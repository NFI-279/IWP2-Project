package com.iwp2.backend.repository;

import com.iwp2.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

	List<Reservation> findByTeacher_Email(String email);
}