package com.iwp2.backend.dto.schedule;

public class SlotSchedule {

	private int slot;
	private boolean reserved;
	private String teacherName;
	private Long reservationId;

	public SlotSchedule(int slot, boolean reserved, String teacherName, Long reservationId) {
		this.slot = slot;
		this.reserved = reserved;
		this.teacherName = teacherName;
		this.reservationId = reservationId;
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
}