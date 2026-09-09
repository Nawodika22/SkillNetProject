package com.skillnet.matching_service.dto;

import lombok.Data;

@Data
public class WorkerDTO {
    private Long id;
    private String name;
    private String email;
    private String profession;
    private String location;
    private Integer yearsOfExperience;
    private boolean available;
}