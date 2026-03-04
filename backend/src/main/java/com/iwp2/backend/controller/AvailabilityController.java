package com.iwp2.backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.iwp2.backend.model.Day;
import com.iwp2.backend.service.ReservationService;

@RestController
@RequestMapping("/availability")
public class AvailabilityController {

	private final ReservationService reservationService;

	public AvailabilityController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	@GetMapping
	public Map<String, Boolean> checkAvailability(
			@RequestParam Long classroomId,
			@RequestParam Integer week,
			@RequestParam Day day,
			@RequestParam Integer slot) {

		boolean available = reservationService.isSlotAvailable(
				classroomId,
				week,
				day,
				slot);

		return Map.of("available", available);
	}
}
