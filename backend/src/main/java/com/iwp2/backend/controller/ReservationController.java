package com.iwp2.backend.controller;

import com.iwp2.backend.dto.ReservationRequest;
import com.iwp2.backend.dto.ReservationResponse;
import com.iwp2.backend.entity.Reservation;
import com.iwp2.backend.service.ReservationService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

	private final ReservationService reservationService;

	public ReservationController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	@PostMapping
	@PreAuthorize("hasRole('TEACHER')")
	public Reservation create(@RequestBody ReservationRequest request,
			Authentication authentication) {

		return reservationService.createReservation(
				request,
				authentication.getName());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
	public void delete(@PathVariable Long id,
			Authentication authentication) {

		reservationService.cancelReservation(id, authentication.getName());
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT')")
	public List<ReservationResponse> getReservations() {
		return reservationService.getAllReservations();
	}
}