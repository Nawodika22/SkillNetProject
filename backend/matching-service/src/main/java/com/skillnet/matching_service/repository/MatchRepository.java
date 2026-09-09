package com.skillnet.matching_service.repository;

import com.skillnet.matching_service.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<MatchResult, Long> {
    List<MatchResult> findByVacancyIdOrderByMatchScoreDesc(Long vacancyId);
    
    // Check if worker is already matched for this vacancy
    Optional<MatchResult> findByVacancyIdAndWorkerId(Long vacancyId, Long workerId);
}