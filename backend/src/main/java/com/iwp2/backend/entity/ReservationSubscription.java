package com.iwp2.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservation_subscriptions", uniqueConstraints = @UniqueConstraint(columnNames = { "reservation_id",
		"student_id" }))
public class ReservationSubscription {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "reservation_id", nullable = false)
	private Reservation reservation;

	@ManyToOne(optional = false)
	@JoinColumn(name = "student_id", nullable = false)
	private User student;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	public ReservationSubscription() {
	}

	public ReservationSubscription(Reservation reservation, User student) {
		this.reservation = reservation;
		this.student = student;
	}

	public Long getId() {
		return id;
	}

	public Reservation getReservation() {
		return reservation;
	}

	public User getStudent() {
		return student;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setReservation(Reservation reservation) {
		this.reservation = reservation;
	}

	public void setStudent(User student) {
		this.student = student;
	}
}