package com.skillnet.matching_service.service;

import com.skillnet.matching_service.dto.VacancyDTO;
import com.skillnet.matching_service.dto.WorkerDTO;
import com.skillnet.matching_service.entity.MatchResult;
import com.skillnet.matching_service.repository.MatchRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class MatchingService {

    private final MatchRepository matchRepository;
    private final NotificationService notificationService;
    private final RestClient restClient;

    public MatchingService(MatchRepository matchRepository, NotificationService notificationService, RestClient restClient) {
        this.matchRepository = matchRepository;
        this.notificationService = notificationService;
        this.restClient = restClient;
    }

    public List<MatchResult> matchWorkersForVacancy(Long vacancyId) {
        // 1. Fetch vacancy from Member 2 (Port 8082)
        VacancyDTO vacancy = restClient.get()
                .uri("http://localhost:8082/api/vacancies/" + vacancyId)
                .retrieve()
                .body(VacancyDTO.class);

        if (vacancy == null) {
            throw new RuntimeException("Vacancy not found with ID: " + vacancyId);
        }

        // 2. Fetch workers from user-service (Port 8081)
        List<WorkerDTO> workers = List.of();
        try {
            workers = restClient.get()
                    .uri("http://localhost:8081/api/workers/search")
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<WorkerDTO>>() {});
        } catch (Exception e) {
            System.out.println("Worker fetch error: " + e.getMessage());
        }

        if (workers == null || workers.isEmpty()) {
            return List.of();
        }

        List<MatchResult> matchedResults = new ArrayList<>();

        for (WorkerDTO worker : workers) {
            double score = 0.0;
            StringBuilder reason = new StringBuilder();

            // 50% Profession Match
            if (vacancy.getJobTitle() != null && worker.getProfession() != null &&
                vacancy.getJobTitle().trim().equalsIgnoreCase(worker.getProfession().trim())) {
                score += 50.0;
                reason.append("Profession matched; ");
            }

            // 30% Location Match
            if (vacancy.getTargetLocation() != null && worker.getLocation() != null &&
                vacancy.getTargetLocation().trim().equalsIgnoreCase(worker.getLocation().trim())) {
                score += 30.0;
                reason.append("Location matched; ");
            }

            // 20% Experience Match
            if (worker.getYearsOfExperience() != null && vacancy.getMinExperience() != null) {
                if (worker.getYearsOfExperience() >= vacancy.getMinExperience()) {
                    score += 20.0;
                    reason.append("Experience requirement met; ");
                } else {
                    double expRatio = (double) worker.getYearsOfExperience() / vacancy.getMinExperience();
                    score += (expRatio * 20.0);
                }
            }

            // Threshold Check & Duplicate Prevention
            if (score >= 50.0) {
                var existingMatch = matchRepository.findByVacancyIdAndWorkerId(vacancy.getVacancyId(), worker.getId());

                if (existingMatch.isEmpty()) {
                    MatchResult result = MatchResult.builder()
                            .vacancyId(vacancy.getVacancyId())
                            .workerId(worker.getId())
                            .workerName(worker.getName())
                            .vacancyTitle(vacancy.getJobTitle())
                            .matchScore(Math.round(score * 10.0) / 10.0)
                            .matchReason(reason.toString())
                            .build();

                    matchedResults.add(matchRepository.save(result));

                    // Notification Trigger (Only sends once)
                    notificationService.sendMatchNotification(
                            worker.getId(),
                            worker.getName(),
                            vacancy.getJobTitle(),
                            score
                    );
                }
            }
        }

        return matchRepository.findByVacancyIdOrderByMatchScoreDesc(vacancyId);
    }
}