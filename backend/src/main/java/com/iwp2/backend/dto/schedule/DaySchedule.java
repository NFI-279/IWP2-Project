package com.iwp2.backend.dto.schedule;

import com.iwp2.backend.model.Day;
import java.util.List;

public class DaySchedule {

	private Day day;
	private List<SlotSchedule> slots;

	public DaySchedule(Day day, List<SlotSchedule> slots) {
		this.day = day;
		this.slots = slots;
	}

	public Day getDay() {
		return day;
	}

	public List<SlotSchedule> getSlots() {
		return slots;
	}
}