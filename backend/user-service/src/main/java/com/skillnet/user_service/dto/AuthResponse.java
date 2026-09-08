package com.skillnet.user_service.dto;

public record AuthResponse(String token, String role, Long userId) {
}
