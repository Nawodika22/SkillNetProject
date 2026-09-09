package com.skillnet.matching_service.dto;

import lombok.Data;

@Data
public class VacancyDTO {
    private Long vacancyId;
    private Long companyId;
    private String jobTitle;
    private String requiredSkills;
    private Integer minExperience;
    private String targetLocation;
}