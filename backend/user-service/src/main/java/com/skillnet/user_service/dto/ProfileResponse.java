package com.skillnet.user_service.dto;

import com.skillnet.user_service.entity.User;

public record ProfileResponse(Long id, String email, String role, String name, String profession,
                              Integer yearsOfExperience, String location, boolean available) {
    public static ProfileResponse from(User user) {
        return new ProfileResponse(user.getId(), user.getEmail(), user.getRole().name(), user.getName(),
                user.getProfession(), user.getYearsOfExperience(), user.getLocation(), user.isAvailable());
    }
}
