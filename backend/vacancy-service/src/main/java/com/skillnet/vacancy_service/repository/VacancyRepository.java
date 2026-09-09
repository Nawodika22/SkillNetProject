package com.skillnet.vacancy_service.repository;

import com.skillnet.vacancy_service.entity.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Long> {
    List<Vacancy> findByCompanyId(Long companyId);
}