package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.WorkerProfileDto;
import com.skillnet.user_service.dto.AvailabilityUpdateDto;
import com.skillnet.user_service.service.WorkerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WorkerProfileController {

	private final WorkerProfileService workerProfileService;

	/**
	 * Get worker profile by user ID
	 */
	@GetMapping("/profile/{userId}")
	public ResponseEntity<?> getWorkerProfile(@PathVariable Long userId) {
		return workerProfileService.getWorkerProfile(userId);
	}

	/**
	 * Update worker profile
	 */
	@PutMapping("/profile/{userId}")
	public ResponseEntity<?> updateWorkerProfile(
		@PathVariable Long userId,
		@Valid @RequestBody WorkerProfileDto profileDto) {
		return workerProfileService.updateWorkerProfile(userId, profileDto);
	}

	/**
	 * Update worker availability status (Available/Unavailable)
	 */
	@PutMapping("/{userId}/availability")
	public ResponseEntity<?> updateAvailability(
		@PathVariable Long userId,
		@Valid @RequestBody AvailabilityUpdateDto availabilityDto) {
		return workerProfileService.updateAvailability(userId, availabilityDto);
	}

	/**
	 * Get all available workers in a specific location
	 */
	@GetMapping("/available/location/{location}")
	public ResponseEntity<?> getAvailableWorkersByLocation(@PathVariable String location) {
		return workerProfileService.getAvailableWorkersByLocation(location);
	}

	/**
	 * Get all available workers by profession
	 */
	@GetMapping("/available/profession/{profession}")
	public ResponseEntity<?> getAvailableWorkersByProfession(@PathVariable String profession) {
		return workerProfileService.getAvailableWorkersByProfession(profession);
	}

	/**
	 * Get all workers (with all availability statuses)
	 */
	@GetMapping("/all")
	public ResponseEntity<?> getAllWorkers() {
		return workerProfileService.getAllWorkers();
	}
}
