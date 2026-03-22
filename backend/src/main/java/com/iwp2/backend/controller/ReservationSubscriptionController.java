package com.iwp2.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.iwp2.backend.entity.User;
import com.iwp2.backend.service.ReservationSubscriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationSubscriptionController {

	private final ReservationSubscriptionService service;

	@PostMapping("/{id}/subscribe")
	public ResponseEntity<?> subscribe(@PathVariable Long id,
			@RequestParam Long studentId) {

		service.subscribe(id, studentId);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/{id}/subscribe")
	public ResponseEntity<?> unsubscribe(@PathVariable Long id,
			@RequestParam Long studentId) {

		service.unsubscribe(id, studentId);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/{id}/students")
	public ResponseEntity<List<User>> getStudents(@PathVariable Long id) {

		return ResponseEntity.ok(service.getStudents(id));
	}
}