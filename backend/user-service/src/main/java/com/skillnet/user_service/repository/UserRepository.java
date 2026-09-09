package com.skillnet.user_service.repository;

import com.skillnet.user_service.entity.User;
import com.skillnet.user_service.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	List<User> findByRole(UserRole role);
	Optional<User> findByUserIdAndRole(Long userId, UserRole role);
	Boolean existsByEmail(String email);
}
