package com.skillnet.user_service.service.impl;

import com.skillnet.user_service.dto.HRProfileDto;
import com.skillnet.user_service.entity.HRProfile;
import com.skillnet.user_service.repository.HRProfileRepository;
import com.skillnet.user_service.service.HRProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HRProfileServiceImpl implements HRProfileService {

	private final HRProfileRepository hrProfileRepository;

	@Override
	public ResponseEntity<?> getHRProfile(Long userId) {
		Map<String, Object> response = new HashMap<>();

		try {
			var profileOpt = hrProfileRepository.findByUser_UserId(userId);

			if (profileOpt.isEmpty()) {
				response.put("success", false);
				response.put("message", "HR profile not found");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

			HRProfile profile = profileOpt.get();
			HRProfileDto dto = mapToDto(profile);

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
	public ResponseEntity<?> updateHRProfile(Long userId, HRProfileDto profileDto) {
		Map<String, Object> response = new HashMap<>();

		try {
			var profileOpt = hrProfileRepository.findByUser_UserId(userId);

			if (profileOpt.isEmpty()) {
				response.put("success", false);
				response.put("message", "HR profile not found");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

			HRProfile profile = profileOpt.get();

			// Update fields
			if (profileDto.getCompanyName() != null) {
				profile.setCompanyName(profileDto.getCompanyName());
			}
			if (profileDto.getCompanyEmail() != null) {
				profile.setCompanyEmail(profileDto.getCompanyEmail());
			}
			if (profileDto.getHrContactName() != null) {
				profile.setHrContactName(profileDto.getHrContactName());
			}
			if (profileDto.getPhoneNumber() != null) {
				profile.setPhoneNumber(profileDto.getPhoneNumber());
			}
			if (profileDto.getLocation() != null) {
				profile.setLocation(profileDto.getLocation());
			}
			if (profileDto.getCompanyDescription() != null) {
				profile.setCompanyDescription(profileDto.getCompanyDescription());
			}

			HRProfile updatedProfile = hrProfileRepository.save(profile);
			HRProfileDto dto = mapToDto(updatedProfile);

			response.put("success", true);
			response.put("message", "HR profile updated successfully");
			response.put("data", dto);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "Error updating profile: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	private HRProfileDto mapToDto(HRProfile profile) {
		HRProfileDto dto = new HRProfileDto();
		dto.setProfileId(profile.getProfileId());
		dto.setUserId(profile.getUser().getUserId());
		dto.setCompanyName(profile.getCompanyName());
		dto.setCompanyEmail(profile.getCompanyEmail());
		dto.setHrContactName(profile.getHrContactName());
		dto.setPhoneNumber(profile.getPhoneNumber());
		dto.setLocation(profile.getLocation());
		dto.setCompanyDescription(profile.getCompanyDescription());
		dto.setCreatedAt(profile.getCreatedAt());
		dto.setUpdatedAt(profile.getUpdatedAt());
		return dto;
	}
}
