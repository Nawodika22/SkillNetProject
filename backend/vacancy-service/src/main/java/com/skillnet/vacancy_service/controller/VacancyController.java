package com.skillnet.vacancy_service.controller;

import com.skillnet.vacancy_service.dto.VacancyRequestDto;
import com.skillnet.vacancy_service.entity.Vacancy;
import com.skillnet.vacancy_service.service.VacancyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacancies")
@CrossOrigin(origins = "*")
public class VacancyController {

    @Autowired
    private VacancyService vacancyService;

    @PostMapping
    public ResponseEntity<Vacancy> createVacancy(@RequestBody VacancyRequestDto requestDto) {
        return new ResponseEntity<>(vacancyService.createVacancy(requestDto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Vacancy>> getAllVacancies() {
        return ResponseEntity.ok(vacancyService.getAllVacancies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vacancy> getVacancyById(@PathVariable Long id) {
        return ResponseEntity.ok(vacancyService.getVacancyById(id));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Vacancy>> getVacanciesByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(vacancyService.getVacanciesByCompanyId(companyId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vacancy> updateVacancy(@PathVariable Long id, @RequestBody VacancyRequestDto requestDto) {
        return ResponseEntity.ok(vacancyService.updateVacancy(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVacancy(@PathVariable Long id) {
        vacancyService.deleteVacancy(id);
        return ResponseEntity.ok("Vacancy deleted successfully");
    }
}