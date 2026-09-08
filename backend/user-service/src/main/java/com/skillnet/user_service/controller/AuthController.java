package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.AuthResponse;
import com.skillnet.user_service.dto.LoginRequest;
import com.skillnet.user_service.dto.RegisterRequest;
import com.skillnet.user_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/worker")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registerWorker(@Valid @RequestBody RegisterRequest request) {
        return authService.registerWorker(request);
    }

    @PostMapping("/register/hr")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registerHr(@RequestHeader("X-HR-Registration-Key") String registrationKey,
                                   @Valid @RequestBody RegisterRequest request) {
        return authService.registerHr(request, registrationKey);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
