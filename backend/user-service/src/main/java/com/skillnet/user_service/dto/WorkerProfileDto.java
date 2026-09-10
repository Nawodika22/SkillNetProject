package com.skillnet.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileDto {
    private String name;
    private String profession;
    private Integer yearsOfExperience;
    private String location;
}
