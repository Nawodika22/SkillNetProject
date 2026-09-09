package com.skillnet.user_service.repository;

import com.skillnet.user_service.entity.HRProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HRProfileRepository extends JpaRepository<HRProfile, Long> {
	Optional<HRProfile> findByUser_UserId(Long userId);
	Optional<HRProfile> findByCompanyEmail(String companyEmail);
}
