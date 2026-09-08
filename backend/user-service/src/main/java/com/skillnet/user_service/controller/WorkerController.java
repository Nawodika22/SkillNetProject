package com.skillnet.user_service.controller;

import com.skillnet.user_service.dto.AvailabilityRequest;
import com.skillnet.user_service.dto.ProfileResponse;
import com.skillnet.user_service.dto.ProfileUpdateRequest;
import com.skillnet.user_service.service.ProfileService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {
    private final ProfileService profileService;

    public WorkerController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PutMapping("/me/profile")
    public ProfileResponse updateProfile(Principal principal, @Valid @RequestBody ProfileUpdateRequest request) {
        return ProfileResponse.from(profileService.updateProfile(principal.getName(), request));
    }

    @PatchMapping("/me/availability")
    public ProfileResponse updateAvailability(Principal principal, @Valid @RequestBody AvailabilityRequest request) {
        return ProfileResponse.from(profileService.updateAvailability(principal.getName(), request.available()));
    }

    @GetMapping("/search")
    public List<ProfileResponse> search(@RequestParam(required = false) String profession,
                                        @RequestParam(required = false) String location) {
        return profileService.searchWorkers(profession, location).stream().map(ProfileResponse::from).toList();
    }
}
