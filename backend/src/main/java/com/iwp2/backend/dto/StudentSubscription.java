package com.iwp2.backend.dto;

public class StudentSubscription {

	private Long reservationId;
	private Long classroomId;
	private String classroomName;
	private String teacherName;
	private Integer week;
	private String day;
	private Integer slot;

	public StudentSubscription(Long reservationId, Long classroomId,
			String classroomName, String teacherName,
			Integer week, String day, Integer slot) {

		this.reservationId = reservationId;
		this.classroomId = classroomId;
		this.classroomName = classroomName;
		this.teacherName = teacherName;
		this.week = week;
		this.day = day;
		this.slot = slot;
	}

	public Long getReservationId() {
		return reservationId;
	}

	public Long getClassroomId() {
		return classroomId;
	}

	public String getClassroomName() {
		return classroomName;
	}

	public String getTeacherName() {
		return teacherName;
	}

	public Integer getWeek() {
		return week;
	}

	public String getDay() {
		return day;
	}

	public Integer getSlot() {
		return slot;
	}
}