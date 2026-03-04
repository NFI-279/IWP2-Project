package com.iwp2.backend.model;

public enum Slot {

	SLOT_1(1, "08:00-10:00"),
	SLOT_2(2, "10:00-12:00"),
	SLOT_3(3, "12:00-14:00"),
	SLOT_4(4, "14:00-16:00"),
	SLOT_5(5, "16:00-18:00"),
	SLOT_6(6, "18:00-20:00");

	private final int value;
	private final String label;

	Slot(int value, String label) {
		this.value = value;
		this.label = label;
	}

	public int getValue() {
		return value;
	}

	public String getLabel() {
		return label;
	}

	public static Slot fromValue(int value) {
		for (Slot slot : Slot.values()) {
			if (slot.value == value) {
				return slot;
			}
		}
		throw new IllegalArgumentException("Invalid slot value: " + value);
	}
}