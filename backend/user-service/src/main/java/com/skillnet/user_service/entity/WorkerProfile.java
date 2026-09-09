package com.skillnet.user_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long profileId;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(nullable = false)
	private String firstName;

	@Column(nullable = false)
	private String lastName;

	@Column(nullable = false, unique = true)
	private String verifiedEmail;

	@Column(nullable = false)
	private String profession; // e.g., "Painter", "Electrician"

	@Column(nullable = false)
	private Integer yearsOfExperience;

	@Column(nullable = false)
	private String location; // City/Region

	@Column(nullable = false)
	private String phoneNumber;

	@Column(columnDefinition = "TEXT")
	private String bio; // Professional bio/description

	@Column(nullable = false)
	private Boolean isAvailable = true; // Real-time availability toggle

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
