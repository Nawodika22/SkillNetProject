package com.skillnet.user_service;

import static org.assertj.core.api.Assertions.assertThat;

import com.skillnet.user_service.dto.RegisterRequest;
import com.skillnet.user_service.entity.User;
import com.skillnet.user_service.repository.UserRepository;
import com.skillnet.user_service.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class AuthServiceTests {
    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void registrationStoresAHashAndIssuesWorkerJwt() {
        var response = authService.registerWorker(new RegisterRequest(
                "worker@example.com", "plain-secret", "Asha", "Painter", 4, "Colombo"));

        User user = userRepository.findByEmail("worker@example.com").orElseThrow();
        assertThat(user.getPassword()).isNotEqualTo("plain-secret");
        assertThat(passwordEncoder.matches("plain-secret", user.getPassword())).isTrue();
        assertThat(response.role()).isEqualTo("WORKER");
        assertThat(response.token()).isNotBlank();
    }
}
