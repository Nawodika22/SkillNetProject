package com.skillnet.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HRProfileDto {

	private Long profileId;
	private Long userId;
	private String companyName;
	private String companyEmail;
	private String hrContactName;
	private String phoneNumber;
	private String location;
	private String companyDescription;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
