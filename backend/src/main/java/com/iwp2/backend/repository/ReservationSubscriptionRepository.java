package com.iwp2.backend.repository;

import com.iwp2.backend.entity.ReservationSubscription;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationSubscriptionRepository extends JpaRepository<ReservationSubscription, Long> {

	int countByReservationId(Long reservationId);

	boolean existsByReservationIdAndStudentId(Long reservationId, Long studentId);

	void deleteByReservationIdAndStudentId(Long reservationId, Long studentId);

	List<ReservationSubscription> findByReservationId(Long reservationId);

	List<ReservationSubscription> findByStudentId(Long studentId);

}