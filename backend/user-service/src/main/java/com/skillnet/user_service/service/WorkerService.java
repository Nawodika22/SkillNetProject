package com.skillnet.user_service.service;

import com.skillnet.user_service.dto.WorkerProfileDto;
import com.skillnet.user_service.dto.WorkerResponseDto;

import java.util.List;

public interface WorkerService {
    List<WorkerResponseDto> searchWorkers(String profession, String location);
    List<WorkerResponseDto> getAllWorkers();
    WorkerResponseDto getWorkerById(Long id);
    WorkerResponseDto updateProfile(Long workerId, WorkerProfileDto dto);
    WorkerResponseDto toggleAvailability(Long workerId, boolean available);
}
