package com.skillnet.user_service.service;

import com.skillnet.user_service.dto.ProfileUpdateRequest;
import com.skillnet.user_service.entity.Role;
import com.skillnet.user_service.entity.User;
import com.skillnet.user_service.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {
    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User requireWorker(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != Role.WORKER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Worker profile required");
        }
        return user;
    }

    public User updateProfile(String email, ProfileUpdateRequest request) {
        User user = requireWorker(email);
        user.setName(request.name());
        user.setProfession(request.profession());
        user.setYearsOfExperience(request.yearsOfExperience());
        user.setLocation(request.location());
        return userRepository.save(user);
    }

    public User updateAvailability(String email, boolean available) {
        User user = requireWorker(email);
        user.setAvailable(available);
        return userRepository.save(user);
    }

    public List<User> searchWorkers(String profession, String location) {
        return userRepository.findByRoleAndAvailableTrueAndProfessionContainingIgnoreCaseAndLocationContainingIgnoreCase(
                Role.WORKER, profession == null ? "" : profession, location == null ? "" : location);
    }
}
