package com.iwp2.backend.dto;

public class ProfileStat {

	private String label;
	private Integer value;

	public ProfileStat(String label, Integer value) {
		this.label = label;
		this.value = value;
	}

	public String getLabel() {
		return label;
	}

	public Integer getValue() {
		return value;
	}
}