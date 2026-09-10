package com.skillnet.user_service.service.impl;

import com.skillnet.user_service.dto.AuthResponseDto;
import com.skillnet.user_service.dto.HrRegisterDto;
import com.skillnet.user_service.dto.LoginRequestDto;
import com.skillnet.user_service.dto.WorkerRegisterDto;
import com.skillnet.user_service.entity.Company;
import com.skillnet.user_service.entity.Worker;
import com.skillnet.user_service.repository.CompanyRepository;
import com.skillnet.user_service.repository.WorkerRepository;
import com.skillnet.user_service.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthServiceImpl implements AuthService {

    private final WorkerRepository workerRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    // Token session registry: token -> userId
    private final Map<String, Long> tokenToUserIdMap = new ConcurrentHashMap<>();

    public AuthServiceImpl(WorkerRepository workerRepository,
                           CompanyRepository companyRepository,
                           PasswordEncoder passwordEncoder) {
        this.workerRepository = workerRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponseDto registerWorker(WorkerRegisterDto dto) {
        if (workerRepository.existsByEmail(dto.getEmail()) || companyRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email is already registered: " + dto.getEmail());
        }

        Worker worker = Worker.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .profession(dto.getProfession())
                .experienceYears(dto.getYearsOfExperience() != null ? dto.getYearsOfExperience() : 0)
                .location(dto.getLocation())
                .isAvailable(true)
                .workerPassword(passwordEncoder.encode(dto.getPassword()))
                .build();

        Worker saved = workerRepository.save(worker);
        String token = "worker-token-" + UUID.randomUUID().toString().substring(0, 8);
        tokenToUserIdMap.put(token, saved.getWorkerId());

        return AuthResponseDto.builder()
                .id(saved.getWorkerId())
                .role("WORKER")
                .token(token)
                .name(saved.getName())
                .email(saved.getEmail())
                .profession(saved.getProfession())
                .yearsOfExperience(saved.getExperienceYears())
                .location(saved.getLocation())
                .available(saved.getIsAvailable())
                .build();
    }

    @Override
    public AuthResponseDto registerHr(HrRegisterDto dto) {
        if (companyRepository.existsByEmail(dto.getEmail()) || workerRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email is already registered: " + dto.getEmail());
        }

        String compName = (dto.getCompanyName() != null && !dto.getCompanyName().isBlank()) 
                ? dto.getCompanyName() 
                : dto.getName() + " Enterprise";

        Company company = Company.builder()
                .hrName(dto.getName())
                .companyName(compName)
                .email(dto.getEmail())
                .location(dto.getLocation() != null ? dto.getLocation() : "Sri Lanka")
                .companyPassword(passwordEncoder.encode(dto.getPassword()))
                .build();

        Company saved = companyRepository.save(company);
        String token = "hr-token-" + UUID.randomUUID().toString().substring(0, 8);
        tokenToUserIdMap.put(token, saved.getCompanyId());

        return AuthResponseDto.builder()
                .id(saved.getCompanyId())
                .role("HR")
                .token(token)
                .name(saved.getHrName())
                .companyName(saved.getCompanyName())
                .email(saved.getEmail())
                .location(saved.getLocation())
                .build();
    }

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {
        // 1. Check Worker repository
        Optional<Worker> workerOpt = workerRepository.findByEmail(dto.getEmail());
        if (workerOpt.isPresent()) {
            Worker worker = workerOpt.get();
            if (matchesPassword(dto.getPassword(), worker.getWorkerPassword())) {
                String token = "worker-token-" + UUID.randomUUID().toString().substring(0, 8);
                tokenToUserIdMap.put(token, worker.getWorkerId());

                return AuthResponseDto.builder()
                        .id(worker.getWorkerId())
                        .role("WORKER")
                        .token(token)
                        .name(worker.getName())
                        .email(worker.getEmail())
                        .profession(worker.getProfession())
                        .yearsOfExperience(worker.getExperienceYears())
                        .location(worker.getLocation())
                        .available(worker.getIsAvailable())
                        .build();
            }
        }

        // 2. Check Company repository
        Optional<Company> companyOpt = companyRepository.findByEmail(dto.getEmail());
        if (companyOpt.isPresent()) {
            Company company = companyOpt.get();
            if (matchesPassword(dto.getPassword(), company.getCompanyPassword())) {
                String token = "hr-token-" + UUID.randomUUID().toString().substring(0, 8);
                tokenToUserIdMap.put(token, company.getCompanyId());

                return AuthResponseDto.builder()
                        .id(company.getCompanyId())
                        .role("HR")
                        .token(token)
                        .name(company.getHrName())
                        .companyName(company.getCompanyName())
                        .email(company.getEmail())
                        .location(company.getLocation())
                        .build();
            }
        }

        throw new RuntimeException("Invalid email or password");
    }

    @Override
    public Long resolveUserIdFromToken(String authHeader) {
        if (authHeader == null || authHeader.isBlank()) {
            return null;
        }

        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : authHeader.trim();

        // Check explicit map
        if (tokenToUserIdMap.containsKey(token)) {
            return tokenToUserIdMap.get(token);
        }

        // Demo token fallback
        if ("demo-token".equalsIgnoreCase(token)) {
            return 1L;
        }

        return null;
    }

    private boolean matchesPassword(String rawPassword, String encodedPassword) {
        if (passwordEncoder.matches(rawPassword, encodedPassword)) {
            return true;
        }
        // Fallback to plain text comparison in case of unhashed seeds
        return rawPassword.equals(encodedPassword);
    }
}
