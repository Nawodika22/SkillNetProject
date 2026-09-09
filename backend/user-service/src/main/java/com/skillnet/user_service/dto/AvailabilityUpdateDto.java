package com.skillnet.user_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityUpdateDto {

	@NotNull(message = "Availability status is required")
	private Boolean isAvailable;
}
