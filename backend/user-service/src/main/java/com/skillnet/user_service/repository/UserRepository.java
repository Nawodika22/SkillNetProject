package com.skillnet.user_service.repository;

import com.skillnet.user_service.entity.Role;
import com.skillnet.user_service.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRoleAndAvailableTrueAndProfessionContainingIgnoreCaseAndLocationContainingIgnoreCase(
            Role role, String profession, String location);
}
