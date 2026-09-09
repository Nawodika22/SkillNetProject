package com.skillnet.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileDto {

	private Long profileId;
	private Long userId;
	private String firstName;
	private String lastName;
	private String verifiedEmail;
	private String profession;
	private Integer yearsOfExperience;
	private String location;
	private String phoneNumber;
	private String bio;
	private Boolean isAvailable;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
