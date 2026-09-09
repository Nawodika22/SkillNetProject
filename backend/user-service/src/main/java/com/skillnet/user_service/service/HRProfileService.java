package com.skillnet.user_service.service;

import com.skillnet.user_service.dto.HRProfileDto;
import org.springframework.http.ResponseEntity;

public interface HRProfileService {
	ResponseEntity<?> getHRProfile(Long userId);
	ResponseEntity<?> updateHRProfile(Long userId, HRProfileDto profileDto);
}
