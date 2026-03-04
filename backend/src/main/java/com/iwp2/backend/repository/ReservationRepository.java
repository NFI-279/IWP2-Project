package com.iwp2.backend.repository;

import com.iwp2.backend.entity.Reservation;
import com.iwp2.backend.model.Day;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

	List<Reservation> findByTeacher_Email(String email);

	List<Reservation> findByClassroom_IdAndWeekNumber(Long classroomId, Integer weekNumber);

	List<Reservation> findByTeacher_EmailAndWeekNumber(String email, Integer weekNumber);

	boolean existsByClassroom_IdAndWeekNumberAndDayAndTimeSlot(
			Long classroomId,
			Integer weekNumber,
			Day day,
			Integer timeSlot);
}