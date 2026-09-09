package com.skillnet.vacancy_service.service;

import com.skillnet.vacancy_service.dto.VacancyRequestDto;
import com.skillnet.vacancy_service.entity.Vacancy;
import java.util.List;

public interface VacancyService {
    Vacancy createVacancy(VacancyRequestDto requestDto);
    List<Vacancy> getAllVacancies();
    Vacancy getVacancyById(Long id);
    List<Vacancy> getVacanciesByCompanyId(Long companyId);
    Vacancy updateVacancy(Long id, VacancyRequestDto requestDto);
    void deleteVacancy(Long id);
}