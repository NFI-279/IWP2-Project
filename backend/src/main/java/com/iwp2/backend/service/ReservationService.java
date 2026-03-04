package com.iwp2.backend.service;

import com.iwp2.backend.dto.ReservationRequest;
import com.iwp2.backend.entity.*;
import com.iwp2.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReservationService {

	private final ReservationRepository reservationRepository;
	private final UserRepository userRepository;
	private final ClassroomRepository classroomRepository;

	public ReservationService(ReservationRepository reservationRepository,
			UserRepository userRepository,
			ClassroomRepository classroomRepository) {
		this.reservationRepository = reservationRepository;
		this.userRepository = userRepository;
		this.classroomRepository = classroomRepository;
	}

	@Transactional
	public Reservation createReservation(ReservationRequest request, String email) {

		User teacher = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));

		Classroom classroom = classroomRepository.findById(request.getClassroomId())
				.orElseThrow(() -> new RuntimeException("Classroom not found"));

		Reservation reservation = new Reservation();
		reservation.setTeacher(teacher);
		reservation.setClassroom(classroom);
		reservation.setWeekNumber(request.getWeekNumber());
		reservation.setDayOfWeek(request.getDayOfWeek());
		reservation.setTimeSlot(request.getTimeSlot());

		return reservationRepository.save(reservation);
	}

	@Transactional
	public void cancelReservation(Long id, String email) {

		Reservation reservation = reservationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Reservation not found"));

		User currentUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));

		boolean isAdmin = currentUser.getRole().getName().equals("ADMIN");
		boolean isOwner = reservation.getTeacher().getId()
				.equals(currentUser.getId());

		if (!isAdmin && !isOwner) {
			throw new RuntimeException("You cannot cancel this reservation");
		}

		reservationRepository.delete(reservation);
	}

	public List<Reservation> getAllReservations() {
		return reservationRepository.findAll();
	}

	public List<Reservation> getReservationsForTeacher(String email) {
		return reservationRepository.findByTeacher_Email(email);
	}
}