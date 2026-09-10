package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.AvailabilityDto;
import com.skillnet.user_service.dto.WorkerProfileDto;
import com.skillnet.user_service.dto.WorkerResponseDto;
import com.skillnet.user_service.service.AuthService;
import com.skillnet.user_service.service.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerService workerService;
    private final AuthService authService;

    public WorkerController(WorkerService workerService, AuthService authService) {
        this.workerService = workerService;
        this.authService = authService;
    }

    /**
     * Localized Guest Discovery & Microservice Search:
     * Scans for available nearby workers based on optional profession and location.
     */
    @GetMapping("/search")
    public ResponseEntity<List<WorkerResponseDto>> searchWorkers(
            @RequestParam(required = false) String profession,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(workerService.searchWorkers(profession, location));
    }

    @GetMapping
    public ResponseEntity<List<WorkerResponseDto>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponseDto> getWorkerById(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getWorkerById(id));
    }

    /**
     * Get authenticated worker profile
     */
    @GetMapping("/me/profile")
    public ResponseEntity<WorkerResponseDto> getMyProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long workerId = authService.resolveUserIdFromToken(authHeader);
        if (workerId == null) {
            // Default to first worker or 1L for graceful fallback
            workerId = 1L;
        }
        return ResponseEntity.ok(workerService.getWorkerById(workerId));
    }

    /**
     * Update authenticated worker profile
     */
    @PutMapping("/me/profile")
    public ResponseEntity<WorkerResponseDto> updateMyProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody WorkerProfileDto dto) {
        Long workerId = authService.resolveUserIdFromToken(authHeader);
        if (workerId == null) {
            workerId = 1L;
        }
        return ResponseEntity.ok(workerService.updateProfile(workerId, dto));
    }

    /**
     * Real-time availability toggle
     */
    @PatchMapping("/me/availability")
    public ResponseEntity<WorkerResponseDto> toggleMyAvailability(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody AvailabilityDto dto) {
        Long workerId = authService.resolveUserIdFromToken(authHeader);
        if (workerId == null) {
            workerId = 1L;
        }
        return ResponseEntity.ok(workerService.toggleAvailability(workerId, dto.isAvailable()));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<WorkerResponseDto> updateWorkerProfile(
            @PathVariable Long id,
            @RequestBody WorkerProfileDto dto) {
        return ResponseEntity.ok(workerService.updateProfile(id, dto));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<WorkerResponseDto> toggleWorkerAvailability(
            @PathVariable Long id,
            @RequestBody AvailabilityDto dto) {
        return ResponseEntity.ok(workerService.toggleAvailability(id, dto.isAvailable()));
    }
}
