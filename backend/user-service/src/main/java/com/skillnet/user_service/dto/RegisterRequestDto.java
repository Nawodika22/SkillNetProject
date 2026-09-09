package com.skillnet.user_service.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {

	@NotBlank(message = "Email is required")
	@Email(message = "Email should be valid")
	private String email;

	@NotBlank(message = "Password is required")
	@Size(min = 6, message = "Password must be at least 6 characters")
	private String password;

	@NotBlank(message = "Role is required")
	private String role; // "HR" or "WORKER"

	// For HR Registration
	private String companyName;
	private String companyEmail;
	private String hrContactName;
	private String phoneNumber;
	private String location;
	private String companyDescription;

	// For Worker Registration
	private String firstName;
	private String lastName;
	private String verifiedEmail;
	private String profession;
	private Integer yearsOfExperience;
	private String workerLocation;
	private String workerPhoneNumber;
	private String bio;
}
