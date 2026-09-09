package com.skillnet.user_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "hr_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HRProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long profileId;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(nullable = false)
	private String companyName;

	@Column(nullable = false)
	private String companyEmail;

	@Column(nullable = false)
	private String hrContactName;

	@Column(nullable = false)
	private String phoneNumber;

	@Column(nullable = false)
	private String location;

	@Column(columnDefinition = "TEXT")
	private String companyDescription;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
