package com.skillnet.user_service.service.impl;

import com.skillnet.user_service.entity.Company;
import com.skillnet.user_service.repository.CompanyRepository;
import com.skillnet.user_service.service.CompanyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + id));
    }

    @Override
    public Company getCompanyByEmail(String email) {
        return companyRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Company not found with email: " + email));
    }

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }
}
