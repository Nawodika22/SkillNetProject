package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.LoginRequestDto;
import com.skillnet.user_service.dto.RegisterRequestDto;
import com.skillnet.user_service.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Vite default port
public class AuthenticationController {

	private final AuthenticationService authenticationService;

	/**
	 * Register a new HR or Worker account
	 */
	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto registerRequest) {
		return authenticationService.register(registerRequest);
	}

	/**
	 * Login with email and password
	 */
	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginRequest) {
		return authenticationService.login(loginRequest);
	}

	/**
	 * Verify user existence
	 */
	@GetMapping("/verify/{userId}")
	public ResponseEntity<?> verifyUser(@PathVariable Long userId) {
		return authenticationService.verifyUser(userId);
	}
}
