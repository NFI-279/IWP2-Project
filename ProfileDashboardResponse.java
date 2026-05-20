package com.iwp2.backend.dto;

import java.util.List;

public class ProfileDashboardResponse {

	private List<ProfileStat> stats;
	private List<String> recentActivity;

	public ProfileDashboardResponse(
			List<ProfileStat> stats,
			List<String> recentActivity) {

		this.stats = stats;
		this.recentActivity = recentActivity;
	}

	public List<ProfileStat> getStats() {
		return stats;
	}

	public List<String> getRecentActivity() {
		return recentActivity;
	}
}