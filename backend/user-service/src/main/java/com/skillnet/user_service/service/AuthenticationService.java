package com.skillnet.user_service.service;

import com.skillnet.user_service.dto.LoginRequestDto;
import com.skillnet.user_service.dto.LoginResponseDto;
import com.skillnet.user_service.dto.RegisterRequestDto;
import com.skillnet.user_service.entity.User;
import com.skillnet.user_service.entity.UserRole;
import org.springframework.http.ResponseEntity;

public interface AuthenticationService {
	ResponseEntity<?> register(RegisterRequestDto registerRequest);
	ResponseEntity<?> login(LoginRequestDto loginRequest);
	ResponseEntity<?> verifyUser(Long userId);
}
