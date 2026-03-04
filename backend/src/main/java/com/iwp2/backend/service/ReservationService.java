package com.iwp2.backend.service;

import com.iwp2.backend.dto.ReservationRequest;
import com.iwp2.backend.dto.ReservationResponse;
import com.iwp2.backend.entity.*;
import com.iwp2.backend.model.Day;
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

		if (request.getDayOfWeek() < 1 || request.getDayOfWeek() > 7) {
			throw new RuntimeException("Invalid day");
		}

		if (request.getTimeSlot() < 1 || request.getTimeSlot() > 6) {
			throw new RuntimeException("Invalid slot");
		}

		Day day = Day.fromValue(request.getDayOfWeek());

		Reservation reservation = new Reservation();
		reservation.setTeacher(teacher);
		reservation.setClassroom(classroom);
		reservation.setWeekNumber(request.getWeekNumber());
		reservation.setDay(day);
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

	public List<ReservationResponse> getAllReservations() {

		return reservationRepository.findAll()
				.stream()
				.map(ReservationResponse::new)
				.toList();
	}

	public List<ReservationResponse> getReservationsForTeacher(String email) {

		return reservationRepository.findByTeacher_Email(email)
				.stream()
				.map(ReservationResponse::new)
				.toList();
	}

	public List<ReservationResponse> getTeacherSchedule(String email, Integer week) {

		return reservationRepository
				.findByTeacher_EmailAndWeekNumber(email, week)
				.stream()
				.map(ReservationResponse::new)
				.toList();
	}

	public boolean isSlotAvailable(Long classroomId, Integer week, Day day, Integer slot) {

		return !reservationRepository
				.existsByClassroom_IdAndWeekNumberAndDayAndTimeSlot(
						classroomId,
						week,
						day,
						slot);
	}
}