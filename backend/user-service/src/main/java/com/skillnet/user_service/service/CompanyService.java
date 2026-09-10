package com.skillnet.user_service.service;

import com.skillnet.user_service.entity.Company;

import java.util.List;

public interface CompanyService {
    Company getCompanyById(Long id);
    Company getCompanyByEmail(String email);
    List<Company> getAllCompanies();
}
