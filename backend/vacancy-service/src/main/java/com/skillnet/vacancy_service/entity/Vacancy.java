package com.skillnet.vacancy_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vacancy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vacancy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vacancy_id")
    private Long vacancyId;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "required_skills", nullable = false)
    private String requiredSkills;

    @Column(name = "min_experience", nullable = false)
    private Integer minExperience;

    @Column(name = "target_location", nullable = false)
    private String targetLocation;
}
