package com.iwp2.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.iwp2.backend.dto.StudentSubscription;
import com.iwp2.backend.dto.UserResponse;
import com.iwp2.backend.entity.Reservation;
import com.iwp2.backend.entity.ReservationSubscription;
import com.iwp2.backend.entity.User;
import com.iwp2.backend.repository.ReservationRepository;
import com.iwp2.backend.repository.ReservationSubscriptionRepository;
import com.iwp2.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationSubscriptionService {

	private final ReservationRepository reservationRepository;
	private final ReservationSubscriptionRepository subscriptionRepository;
	private final UserRepository userRepository;

	@Transactional
	public void subscribe(Long reservationId, Long studentId) {

		Reservation reservation = reservationRepository.findById(reservationId)
				.orElseThrow(() -> new RuntimeException("Reservation not found"));
		User student = userRepository.findById(studentId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (!student.getRole().getName().equals("STUDENT")) {
			throw new RuntimeException("Only students can subscribe");
		}
		if (subscriptionRepository.existsByReservationIdAndStudentId(reservationId, studentId)) {
			throw new RuntimeException("Already subscribed");
		}

		int current = subscriptionRepository.countByReservationId(reservationId);
		int capacity = reservation.getClassroom().getCapacity();

		if (current >= capacity) {
			throw new RuntimeException("Class is full");
		}

		ReservationSubscription sub = new ReservationSubscription(reservation, student);
		subscriptionRepository.save(sub);
	}

	@Transactional
	public void unsubscribe(Long reservationId, Long studentId) {

		if (!subscriptionRepository.existsByReservationIdAndStudentId(reservationId, studentId)) {
			throw new RuntimeException("Not subscribed");
		}

		subscriptionRepository.deleteByReservationIdAndStudentId(reservationId, studentId);
	}

	public List<UserResponse> getStudents(Long reservationId) {

		return subscriptionRepository.findByReservationId(reservationId)
				.stream()
				.map(sub -> {
					User u = sub.getStudent();
					return new UserResponse(u);
				})
				.toList();
	}

	public List<StudentSubscription> getStudentSubscriptions(Long studentId) {

		return subscriptionRepository.findByStudentId(studentId)
				.stream()
				.map(sub -> {
					Reservation r = sub.getReservation();

					return new StudentSubscription(
							r.getId(),
							r.getClassroom().getId(),
							r.getClassroom().getName(),
							r.getTeacher().getEmail(),
							r.getWeekNumber(),
							r.getDay().name(),
							r.getTimeSlot());
				})
				.toList();
	}
}