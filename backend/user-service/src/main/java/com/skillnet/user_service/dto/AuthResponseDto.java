package com.skillnet.user_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponseDto {
    private Long id;
    private String role; // "WORKER" or "HR"
    private String token;
    private String name;
    private String email;
    private String companyName;
    private String profession;
    private Integer yearsOfExperience;
    private String location;
    private Boolean available;
}
