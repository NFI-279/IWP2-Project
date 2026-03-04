package com.iwp2.backend.dto;

import com.iwp2.backend.entity.Reservation;
import com.iwp2.backend.model.Day;

public class ReservationResponse {

	private Long id;
	private String classroomName;
	private String teacherEmail;
	private Integer week;
	private Day day;
	private Integer slot;

	public ReservationResponse(Reservation reservation) {
		this.id = reservation.getId();
		this.classroomName = reservation.getClassroom().getName();
		this.teacherEmail = reservation.getTeacher().getEmail();
		this.week = reservation.getWeekNumber();
		this.day = reservation.getDay();
		this.slot = reservation.getTimeSlot();
	}

	public Long getId() {
		return id;
	}

	public String getClassroomName() {
		return classroomName;
	}

	public String getTeacherEmail() {
		return teacherEmail;
	}

	public Integer getWeek() {
		return week;
	}

	public Day getDay() {
		return day;
	}

	public Integer getSlot() {
		return slot;
	}
}