package com.iwp2.backend.controller;

import com.iwp2.backend.dto.ProfileDashboardResponse;
import com.iwp2.backend.service.ProfileService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {

	private final ProfileService profileService;

	public ProfileController(ProfileService profileService) {
		this.profileService = profileService;
	}

	@GetMapping("/dashboard")
	public ProfileDashboardResponse dashboard(
			Authentication authentication) {

		return profileService.getDashboard(
				authentication.getName());
	}
}