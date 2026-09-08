package com.skillnet.user_service.dto;

import jakarta.validation.constraints.PositiveOrZero;

public record ProfileUpdateRequest(String name, String profession,
                                   @PositiveOrZero Integer yearsOfExperience, String location) {
}
