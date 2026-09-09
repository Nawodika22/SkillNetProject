package com.skillnet.matching_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long vacancyId;
    private Long workerId;
    private String workerName;
    private String vacancyTitle;

    private double matchScore;
    private String matchReason;

    private LocalDateTime matchedAt;

    @PrePersist
    public void prePersist() {
        this.matchedAt = LocalDateTime.now();
    }
}