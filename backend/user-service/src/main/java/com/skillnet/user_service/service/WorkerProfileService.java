package com.skillnet.user_service.service;

import com.skillnet.user_service.dto.WorkerProfileDto;
import com.skillnet.user_service.dto.AvailabilityUpdateDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface WorkerProfileService {
	ResponseEntity<?> getWorkerProfile(Long userId);
	ResponseEntity<?> updateWorkerProfile(Long userId, WorkerProfileDto profileDto);
	ResponseEntity<?> updateAvailability(Long userId, AvailabilityUpdateDto availabilityDto);
	ResponseEntity<?> getAvailableWorkersByLocation(String location);
	ResponseEntity<?> getAvailableWorkersByProfession(String profession);
	ResponseEntity<?> getAllWorkers();
}
