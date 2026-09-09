package com.skillnet.user_service.service.impl;

import com.skillnet.user_service.dto.WorkerProfileDto;
import com.skillnet.user_service.dto.AvailabilityUpdateDto;
import com.skillnet.user_service.entity.WorkerProfile;
import com.skillnet.user_service.entity.User;
import com.skillnet.user_service.repository.WorkerProfileRepository;
import com.skillnet.user_service.repository.UserRepository;
import com.skillnet.user_service.service.WorkerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerProfileServiceImpl implements WorkerProfileService {

	private final WorkerProfileRepository workerProfileRepository;
	private final UserRepository userRepository;

	@Override
	public ResponseEntity<?> getWorkerProfile(Long userId) {
		Map<String, Object> response = new HashMap<>();

		try {
			var profileOpt = workerProfileRepository.findByUser_UserId(userId);

			if (profileOpt.isEmpty()) {
				response.put("success", false);
				response.put("message", "Worker profile not found");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

			WorkerProfile profile = profileOpt.get();
			WorkerProfileDto dto = mapToDto(profile);

			response.put("success", true);
			response.put("data", dto);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error retrieving profile: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@Override
	@Transactional
	public ResponseEntity<?> updateWorkerProfile(Long userId, WorkerProfileDto profileDto) {
		Map<String, Object> response = new HashMap<>();

		try {
			var profileOpt = workerProfileRepository.findByUser_UserId(userId);

			if (profileOpt.isEmpty()) {
				response.put("success", false);
				response.put("message", "Worker profile not found");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

			WorkerProfile profile = profileOpt.get();

			// Update fields
			if (profileDto.getFirstName() != null) {
				profile.setFirstName(profileDto.getFirstName());
			}
			if (profileDto.getLastName() != null) {
				profile.setLastName(profileDto.getLastName());
			}
			if (profileDto.getProfession() != null) {
				profile.setProfession(profileDto.getProfession());
			}
			if (profileDto.getYearsOfExperience() != null) {
				profile.setYearsOfExperience(profileDto.getYearsOfExperience());
			}
			if (profileDto.getLocation() != null) {
				profile.setLocation(profileDto.getLocation());
			}
			if (profileDto.getPhoneNumber() != null) {
				profile.setPhoneNumber(profileDto.getPhoneNumber());
			}
			if (profileDto.getBio() != null) {
				profile.setBio(profileDto.getBio());
			}

			WorkerProfile updatedProfile = workerProfileRepository.save(profile);
			WorkerProfileDto dto = mapToDto(updatedProfile);

			response.put("success", true);
			response.put("message", "Profile updated successfully");
			response.put("data", dto);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error updating profile: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@Override
	@Transactional
	public ResponseEntity<?> updateAvailability(Long userId, AvailabilityUpdateDto availabilityDto) {
		Map<String, Object> response = new HashMap<>();

		try {
			var profileOpt = workerProfileRepository.findByUser_UserId(userId);

			if (profileOpt.isEmpty()) {
				response.put("success", false);
				response.put("message", "Worker profile not found");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

			WorkerProfile profile = profileOpt.get();
			profile.setIsAvailable(availabilityDto.getIsAvailable());

			WorkerProfile updatedProfile = workerProfileRepository.save(profile);

			response.put("success", true);
			response.put("message", "Availability updated to: " + (updatedProfile.getIsAvailable() ? "Available" : "Unavailable"));
			response.put("isAvailable", updatedProfile.getIsAvailable());

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error updating availability: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@Override
	public ResponseEntity<?> getAvailableWorkersByLocation(String location) {
		Map<String, Object> response = new HashMap<>();

		try {
			List<WorkerProfile> workers = workerProfileRepository.findAvailableWorkersByLocation(location);
			List<WorkerProfileDto> dtos = workers.stream().map(this::mapToDto).collect(Collectors.toList());

			response.put("success", true);
			response.put("location", location);
			response.put("count", dtos.size());
			response.put("data", dtos);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error retrieving workers: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@Override
	public ResponseEntity<?> getAvailableWorkersByProfession(String profession) {
		Map<String, Object> response = new HashMap<>();

		try {
			List<WorkerProfile> workers = workerProfileRepository.findAvailableWorkersByProfession(profession);
			List<WorkerProfileDto> dtos = workers.stream().map(this::mapToDto).collect(Collectors.toList());

			response.put("success", true);
			response.put("profession", profession);
			response.put("count", dtos.size());
			response.put("data", dtos);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error retrieving workers: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@Override
	public ResponseEntity<?> getAllWorkers() {
		Map<String, Object> response = new HashMap<>();

		try {
			List<WorkerProfile> workers = workerProfileRepository.findAll();
			List<WorkerProfileDto> dtos = workers.stream().map(this::mapToDto).collect(Collectors.toList());

			response.put("success", true);
			response.put("count", dtos.size());
			response.put("data", dtos);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error retrieving workers: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	private WorkerProfileDto mapToDto(WorkerProfile profile) {
		WorkerProfileDto dto = new WorkerProfileDto();
		dto.setProfileId(profile.getProfileId());
		dto.setUserId(profile.getUser().getUserId());
		dto.setFirstName(profile.getFirstName());
		dto.setLastName(profile.getLastName());
		dto.setVerifiedEmail(profile.getVerifiedEmail());
		dto.setProfession(profile.getProfession());
		dto.setYearsOfExperience(profile.getYearsOfExperience());
		dto.setLocation(profile.getLocation());
		dto.setPhoneNumber(profile.getPhoneNumber());
		dto.setBio(profile.getBio());
		dto.setIsAvailable(profile.getIsAvailable());
		dto.setCreatedAt(profile.getCreatedAt());
		dto.setUpdatedAt(profile.getUpdatedAt());
		return dto;
	}
}
