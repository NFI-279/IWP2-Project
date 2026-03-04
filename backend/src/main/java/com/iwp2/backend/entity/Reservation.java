package com.iwp2.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Teacher who created reservation
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "teacher_id", nullable = false)
	private User teacher;

	// Reserved classroom
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "classroom_id", nullable = false)
	private Classroom classroom;

	@Column(name = "week_number", nullable = false)
	private Integer weekNumber;

	@Column(name = "day_of_week", nullable = false)
	private Integer dayOfWeek;

	@Column(name = "time_slot", nullable = false)
	private Integer timeSlot;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public User getTeacher() {
		return teacher;
	}

	public void setTeacher(User teacher) {
		this.teacher = teacher;
	}

	public Classroom getClassroom() {
		return classroom;
	}

	public void setClassroom(Classroom classroom) {
		this.classroom = classroom;
	}

	public Integer getWeekNumber() {
		return weekNumber;
	}

	public void setWeekNumber(Integer weekNumber) {
		this.weekNumber = weekNumber;
	}

	public Integer getDayOfWeek() {
		return dayOfWeek;
	}

	public void setDayOfWeek(Integer dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}

	public Integer getTimeSlot() {
		return timeSlot;
	}

	public void setTimeSlot(Integer timeSlot) {
		this.timeSlot = timeSlot;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}