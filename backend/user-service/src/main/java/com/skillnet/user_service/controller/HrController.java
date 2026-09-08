package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.ProfileResponse;
import com.skillnet.user_service.repository.UserRepository;
import com.skillnet.user_service.entity.Role;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hr")
@PreAuthorize("hasRole('HR')")
public class HrController {
    private final UserRepository userRepository;

    public HrController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/workers")
    public List<ProfileResponse> workers() {
        return userRepository.findAll().stream().filter(user -> user.getRole() == Role.WORKER)
                .map(ProfileResponse::from).toList();
    }
}
