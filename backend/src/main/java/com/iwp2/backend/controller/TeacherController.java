package com.iwp2.backend.controller;

import com.iwp2.backend.dto.ReservationResponse;
import com.iwp2.backend.service.ReservationService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacher")
public class TeacherController {

	private final ReservationService reservationService;

	public TeacherController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	@GetMapping("/schedule")
	public List<ReservationResponse> schedule(
			Authentication authentication,
			@RequestParam Integer week) {

		String email = authentication.getName();

		return reservationService.getTeacherSchedule(email, week);
	}
}