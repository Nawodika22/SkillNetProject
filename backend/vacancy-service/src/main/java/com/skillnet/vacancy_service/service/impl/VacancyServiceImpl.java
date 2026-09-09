package com.skillnet.vacancy_service.service.impl;

import com.skillnet.vacancy_service.dto.VacancyRequestDto;
import com.skillnet.vacancy_service.entity.Vacancy;
import com.skillnet.vacancy_service.repository.VacancyRepository;
import com.skillnet.vacancy_service.service.VacancyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VacancyServiceImpl implements VacancyService {

    @Autowired
    private VacancyRepository vacancyRepository;

    @Override
    public Vacancy createVacancy(VacancyRequestDto requestDto) {
        Vacancy vacancy = new Vacancy();
        vacancy.setCompanyId(requestDto.getCompanyId());
        vacancy.setJobTitle(requestDto.getJobTitle());
        vacancy.setRequiredSkills(requestDto.getRequiredSkills());
        vacancy.setMinExperience(requestDto.getMinExperience());
        vacancy.setTargetLocation(requestDto.getTargetLocation());
        return vacancyRepository.save(vacancy);
    }

    @Override
    public List<Vacancy> getAllVacancies() {
        return vacancyRepository.findAll();
    }

    @Override
    public Vacancy getVacancyById(Long id) {
        return vacancyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vacancy not found with id: " + id));
    }

    @Override
    public List<Vacancy> getVacanciesByCompanyId(Long companyId) {
        return vacancyRepository.findByCompanyId(companyId);
    }

    @Override
    public Vacancy updateVacancy(Long id, VacancyRequestDto requestDto) {
        Vacancy vacancy = getVacancyById(id);
        vacancy.setJobTitle(requestDto.getJobTitle());
        vacancy.setRequiredSkills(requestDto.getRequiredSkills());
        vacancy.setMinExperience(requestDto.getMinExperience());
        vacancy.setTargetLocation(requestDto.getTargetLocation());
        return vacancyRepository.save(vacancy);
    }

    @Override
    public void deleteVacancy(Long id) {
        Vacancy vacancy = getVacancyById(id);
        vacancyRepository.delete(vacancy);
    }
}