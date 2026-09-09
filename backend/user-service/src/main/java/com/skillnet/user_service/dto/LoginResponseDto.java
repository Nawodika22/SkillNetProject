package com.skillnet.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {

	private Long userId;
	private String email;
	private String role;
	private String message;
	private Boolean success;

	public LoginResponseDto(Long userId, String email, String role, Boolean success) {
		this.userId = userId;
		this.email = email;
		this.role = role;
		this.success = success;
		this.message = success ? "Login successful" : "Login failed";
	}
}
