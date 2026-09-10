package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.WorkerResponseDto;
import com.skillnet.user_service.service.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "*")
public class HrController {

    private final WorkerService workerService;

    public HrController(WorkerService workerService) {
        this.workerService = workerService;
    }

    /**
     * Corporate HR worker directory roster
     */
    @GetMapping("/workers")
    public ResponseEntity<List<WorkerResponseDto>> getWorkerRoster() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }
}
