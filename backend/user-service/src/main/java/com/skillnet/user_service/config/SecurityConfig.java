package com.skillnet.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // දැනට endpoints ඔක්කොටම direct access දෙන්න
            )
            .httpBasic(basic -> basic.disable()) // Browser pop-up එක disable කරයි
            .formLogin(form -> form.disable());

        return http.build();
    }
}