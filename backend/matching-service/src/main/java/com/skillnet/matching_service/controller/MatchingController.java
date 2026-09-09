package com.skillnet.matching_service.controller;

import com.skillnet.matching_service.entity.MatchResult;
import com.skillnet.matching_service.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/vacancy/{vacancyId}")
    public ResponseEntity<List<MatchResult>> matchVacancy(@PathVariable Long vacancyId) {
        return ResponseEntity.ok(matchingService.matchWorkersForVacancy(vacancyId));
    }
}