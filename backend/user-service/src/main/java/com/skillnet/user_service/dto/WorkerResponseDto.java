package com.skillnet.user_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerResponseDto {
    private Long id;
    private String name;
    private String email;
    private String profession;
    private String location;

    @JsonProperty("yearsOfExperience")
    private Integer yearsOfExperience;

    @JsonProperty("available")
    private boolean available;

    // Helper property alias for experienceYears
    @JsonProperty("experienceYears")
    public Integer getExperienceYears() {
        return yearsOfExperience;
    }

    // Helper property alias for isAvailable
    @JsonProperty("isAvailable")
    public boolean getIsAvailable() {
        return available;
    }
}
