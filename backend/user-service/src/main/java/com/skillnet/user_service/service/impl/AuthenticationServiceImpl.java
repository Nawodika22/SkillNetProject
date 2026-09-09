package com.skillnet.user_service.service.impl;

import com.skillnet.user_service.dto.LoginRequestDto;
import com.skillnet.user_service.dto.LoginResponseDto;
import com.skillnet.user_service.dto.RegisterRequestDto;
import com.skillnet.user_service.entity.*;
import com.skillnet.user_service.repository.UserRepository;
import com.skillnet.user_service.repository.WorkerProfileRepository;
import com.skillnet.user_service.repository.HRProfileRepository;
import com.skillnet.user_service.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

	private final UserRepository userRepository;
	private final WorkerProfileRepository workerProfileRepository;
	private final HRProfileRepository hrProfileRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public ResponseEntity<?> register(RegisterRequestDto registerRequest) {
		Map<String, Object> response = new HashMap<>();

		// Check if email already exists
		if (userRepository.existsByEmail(registerRequest.getEmail())) {
			response.put("success", false);
			response.put("message", "Email already registered");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		try {
			// Create User entity
			User user = new User();
			user.setEmail(registerRequest.getEmail());
			user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
			user.setRole(UserRole.valueOf(registerRequest.getRole().toUpperCase()));
			user.setIsActive(true);

			User savedUser = userRepository.save(user);

			// Create role-specific profile
			if (UserRole.WORKER.equals(user.getRole())) {
				createWorkerProfile(savedUser, registerRequest);
			} else if (UserRole.HR.equals(user.getRole())) {
				createHRProfile(savedUser, registerRequest);
			}

			response.put("success", true);
			response.put("message", "Registration successful");
			response.put("userId", savedUser.getUserId());
			response.put("email", savedUser.getEmail());
			response.put("role", savedUser.getRole().toString());

			return ResponseEntity.status(HttpStatus.CREATED).body(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Registration failed: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@Override
	public ResponseEntity<?> login(LoginRequestDto loginRequest) {
		Map<String, Object> response = new HashMap<>();

		try {
			// Find user by email
			var userOpt = userRepository.findByEmail(loginRequest.getEmail());

			if (userOpt.isEmpty()) {
				response.put("success", false);
				response.put("message", "Invalid email or password");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
			}

			User user = userOpt.get();

			// Verify password
			if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
				response.put("success", false);
				response.put("message", "Invalid email or password");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
			}

			// Check if user is active
			if (!user.getIsActive()) {
				response.put("success", false);
				response.put("message", "User account is inactive");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
			}

			LoginResponseDto loginResponse = new LoginResponseDto(
				user.getUserId(),
				user.getEmail(),
				user.getRole().toString(),
				true
			);

			response.put("success", true);
			response.put("message", "Login successful");
			response.put("userId", user.getUserId());
			response.put("email", user.getEmail());
			response.put("role", user.getRole().toString());

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Login failed: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@Override
	public ResponseEntity<?> verifyUser(Long userId) {
		Map<String, Object> response = new HashMap<>();

		try {
			var userOpt = userRepository.findById(userId);

			if (userOpt.isEmpty()) {
				response.put("success", false);
				response.put("message", "User not found");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

			User user = userOpt.get();
			response.put("success", true);
			response.put("userId", user.getUserId());
			response.put("email", user.getEmail());
			response.put("role", user.getRole().toString());
			response.put("isActive", user.getIsActive());

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Verification failed: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	private void createWorkerProfile(User user, RegisterRequestDto registerRequest) {
		WorkerProfile profile = new WorkerProfile();
		profile.setUser(user);
		profile.setFirstName(registerRequest.getFirstName());
		profile.setLastName(registerRequest.getLastName());
		profile.setVerifiedEmail(registerRequest.getVerifiedEmail());
		profile.setProfession(registerRequest.getProfession());
		profile.setYearsOfExperience(registerRequest.getYearsOfExperience());
		profile.setLocation(registerRequest.getWorkerLocation());
		profile.setPhoneNumber(registerRequest.getWorkerPhoneNumber());
		profile.setBio(registerRequest.getBio());
		profile.setIsAvailable(true);

		workerProfileRepository.save(profile);
	}

	private void createHRProfile(User user, RegisterRequestDto registerRequest) {
		HRProfile profile = new HRProfile();
		profile.setUser(user);
		profile.setCompanyName(registerRequest.getCompanyName());
		profile.setCompanyEmail(registerRequest.getCompanyEmail());
		profile.setHrContactName(registerRequest.getHrContactName());
		profile.setPhoneNumber(registerRequest.getPhoneNumber());
		profile.setLocation(registerRequest.getLocation());
		profile.setCompanyDescription(registerRequest.getCompanyDescription());

		hrProfileRepository.save(profile);
	}
}
