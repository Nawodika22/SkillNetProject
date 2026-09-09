package com.skillnet.vacancy_service.dto;

import lombok.Data;

@Data
public class VacancyRequestDto {
    private Long companyId;
    private String jobTitle;
    private String requiredSkills;
    private Integer minExperience;
    private String targetLocation;
}