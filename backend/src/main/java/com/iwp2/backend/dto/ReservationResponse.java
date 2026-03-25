package com.iwp2.backend.dto;

import com.iwp2.backend.entity.Reservation;
import com.iwp2.backend.model.Day;

public class ReservationResponse {

	private Long id;
	private Long classroomId;
	private String classroomName;
	private String teacherEmail;
	private Integer week;
	private Day day;
	private Integer slot;
	private String courseName;
	private String description;
	private Integer subscribedCount;
	private Integer capacity;

	public ReservationResponse(Reservation reservation, int subscribedCount) {
		this.id = reservation.getId();
		this.classroomId = reservation.getClassroom().getId();
		this.classroomName = reservation.getClassroom().getName();
		this.teacherEmail = reservation.getTeacher().getEmail();
		this.week = reservation.getWeekNumber();
		this.day = reservation.getDay();
		this.slot = reservation.getTimeSlot();
		this.courseName = reservation.getCourseName();
		this.description = reservation.getDescription();
		this.subscribedCount = subscribedCount;
		this.capacity = reservation.getClassroom().getCapacity();
	}

	public Long getClassroomId() {
		return classroomId;
	}

	public String getCourseName() {
		return courseName;
	}

	public String getDescription() {
		return description;
	}

	public Integer getSubscribedCount() {
		return subscribedCount;
	}

	public Integer getCapacity() {
		return capacity;
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