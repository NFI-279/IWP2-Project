package com.iwp2.backend.dto.schedule;

import java.util.List;

public class ClassroomSchedule {

	private Long classroomId;
	private Integer week;
	private List<DaySchedule> schedule;

	public ClassroomSchedule(Long classroomId, Integer week, List<DaySchedule> schedule) {
		this.classroomId = classroomId;
		this.week = week;
		this.schedule = schedule;
	}

	public Long getClassroomId() {
		return classroomId;
	}

	public Integer getWeek() {
		return week;
	}

	public List<DaySchedule> getSchedule() {
		return schedule;
	}
}