package com.iwp2.backend.dto.schedule;

public class SlotSchedule {

	private int slot;
	private boolean reserved;
	private String teacherName;

	public SlotSchedule(int slot, boolean reserved, String teacherName) {
		this.slot = slot;
		this.reserved = reserved;
		this.teacherName = teacherName;
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
}