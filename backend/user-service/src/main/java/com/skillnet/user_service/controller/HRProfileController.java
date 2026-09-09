package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.HRProfileDto;
import com.skillnet.user_service.service.HRProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hr")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class HRProfileController {

	private final HRProfileService hrProfileService;

	/**
	 * Get HR profile by user ID
	 */
	@GetMapping("/profile/{userId}")
	public ResponseEntity<?> getHRProfile(@PathVariable Long userId) {
		return hrProfileService.getHRProfile(userId);
	}

	/**
	 * Update HR profile
	 */
	@PutMapping("/profile/{userId}")
	public ResponseEntity<?> updateHRProfile(
		@PathVariable Long userId,
		@Valid @RequestBody HRProfileDto profileDto) {
		return hrProfileService.updateHRProfile(userId, profileDto);
	}
}
