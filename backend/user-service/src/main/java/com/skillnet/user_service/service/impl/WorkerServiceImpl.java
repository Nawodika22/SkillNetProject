package com.skillnet.user_service.service.impl;

import com.skillnet.user_service.dto.WorkerProfileDto;
import com.skillnet.user_service.dto.WorkerResponseDto;
import com.skillnet.user_service.entity.Worker;
import com.skillnet.user_service.repository.WorkerRepository;
import com.skillnet.user_service.service.WorkerService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerServiceImpl implements WorkerService {

    private final WorkerRepository workerRepository;

    public WorkerServiceImpl(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    @Override
    public List<WorkerResponseDto> searchWorkers(String profession, String location) {
        String prof = (profession != null && !profession.trim().isEmpty()) ? profession.trim() : null;
        String loc = (location != null && !location.trim().isEmpty()) ? location.trim() : null;

        return workerRepository.searchWorkers(prof, loc, true)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkerResponseDto> getAllWorkers() {
        return workerRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public WorkerResponseDto getWorkerById(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found with ID: " + id));
        return mapToDto(worker);
    }

    @Override
    public WorkerResponseDto updateProfile(Long workerId, WorkerProfileDto dto) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found with ID: " + workerId));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            worker.setName(dto.getName());
        }
        if (dto.getProfession() != null) {
            worker.setProfession(dto.getProfession());
        }
        if (dto.getYearsOfExperience() != null) {
            worker.setExperienceYears(dto.getYearsOfExperience());
        }
        if (dto.getLocation() != null) {
            worker.setLocation(dto.getLocation());
        }

        Worker updated = workerRepository.save(worker);
        return mapToDto(updated);
    }

    @Override
    public WorkerResponseDto toggleAvailability(Long workerId, boolean available) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found with ID: " + workerId));

        worker.setIsAvailable(available);
        Worker updated = workerRepository.save(worker);
        return mapToDto(updated);
    }

    private WorkerResponseDto mapToDto(Worker worker) {
        return WorkerResponseDto.builder()
                .id(worker.getWorkerId())
                .name(worker.getName())
                .email(worker.getEmail())
                .profession(worker.getProfession())
                .location(worker.getLocation())
                .yearsOfExperience(worker.getExperienceYears() != null ? worker.getExperienceYears() : 0)
                .available(Boolean.TRUE.equals(worker.getIsAvailable()))
                .build();
    }
}
