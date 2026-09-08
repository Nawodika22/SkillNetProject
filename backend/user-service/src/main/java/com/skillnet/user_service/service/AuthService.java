package com.skillnet.user_service.service;

import com.skillnet.user_service.dto.AuthResponse;
import com.skillnet.user_service.dto.LoginRequest;
import com.skillnet.user_service.dto.RegisterRequest;
import com.skillnet.user_service.entity.Role;
import com.skillnet.user_service.entity.User;
import com.skillnet.user_service.repository.UserRepository;
import com.skillnet.user_service.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String hrRegistrationKey;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                       @Value("${security.hr-registration-key}") String hrRegistrationKey) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.hrRegistrationKey = hrRegistrationKey;
    }

    public AuthResponse registerWorker(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        User user = new User(request.email().toLowerCase(), passwordEncoder.encode(request.password()), Role.WORKER);
        user.setName(request.name());
        user.setProfession(request.profession());
        user.setYearsOfExperience(request.yearsOfExperience());
        user.setLocation(request.location());
        return authenticate(userRepository.save(user));
    }

    public AuthResponse registerHr(RegisterRequest request, String registrationKey) {
        if (!hrRegistrationKey.equals(registrationKey)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid HR registration key");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        User user = new User(request.email().toLowerCase(), passwordEncoder.encode(request.password()), Role.HR);
        user.setName(request.name());
        return authenticate(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return authenticate(user);
    }

    private AuthResponse authenticate(User user) {
        return new AuthResponse(jwtService.generateToken(user.getEmail(), user.getRole().name()),
                user.getRole().name(), user.getId());
    }
}
