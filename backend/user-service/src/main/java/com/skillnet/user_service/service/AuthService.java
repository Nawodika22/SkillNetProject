package com.skillnet.user_service.service;

import com.skillnet.user_service.dto.AuthResponseDto;
import com.skillnet.user_service.dto.HrRegisterDto;
import com.skillnet.user_service.dto.LoginRequestDto;
import com.skillnet.user_service.dto.WorkerRegisterDto;

public interface AuthService {
    AuthResponseDto registerWorker(WorkerRegisterDto dto);
    AuthResponseDto registerHr(HrRegisterDto dto);
    AuthResponseDto login(LoginRequestDto dto);
    Long resolveUserIdFromToken(String token);
}
