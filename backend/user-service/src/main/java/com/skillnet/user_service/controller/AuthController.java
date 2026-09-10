package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.AuthResponseDto;
import com.skillnet.user_service.dto.HrRegisterDto;
import com.skillnet.user_service.dto.LoginRequestDto;
import com.skillnet.user_service.dto.WorkerRegisterDto;
import com.skillnet.user_service.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/worker")
    public ResponseEntity<?> registerWorker(@RequestBody WorkerRegisterDto dto) {
        try {
            AuthResponseDto response = authService.registerWorker(dto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/register/hr")
    public ResponseEntity<?> registerHr(@RequestBody HrRegisterDto dto) {
        try {
            AuthResponseDto response = authService.registerHr(dto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto dto) {
        try {
            AuthResponseDto response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(e.getMessage()));
        }
    }

    public record ErrorResponse(String message) {}
}
