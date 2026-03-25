package com.iwp2.backend.dto.schedule;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SlotSchedule {

	private int slot;
	private boolean reserved;
	private String teacherName;
	private Long reservationId;
	private int subscribedCount;
	private int capacity;
	@JsonProperty("isSubscribed")
	private boolean isSubscribed;
	private String courseName;
	private String description;

	public SlotSchedule(
			int slot,
			boolean reserved,
			String teacherName,
			Long reservationId,
			int subscribedCount,
			int capacity,
			boolean isSubscribed,
			String courseName,
			String description) {
		this.slot = slot;
		this.reserved = reserved;
		this.teacherName = teacherName;
		this.reservationId = reservationId;
		this.subscribedCount = subscribedCount;
		this.capacity = capacity;
		this.isSubscribed = isSubscribed;
		this.courseName = courseName;
		this.description = description;
	}

	public int getSlot() {
		return slot;
	}

	public boolean isReserved() {
		return reserved;
	}

	public String getTeacherName() {
		return teacherName;
	}

	public Long getReservationId() {
		return reservationId;
	}

	public int getSubscribedCount() {
		return subscribedCount;
	}

	public int getCapacity() {
		return capacity;
	}

	public boolean isSubscribed() {
		return isSubscribed;
	}

	public String getCourseName() {
		return courseName;
	}

	public String getDescription() {
		return description;
	}
}