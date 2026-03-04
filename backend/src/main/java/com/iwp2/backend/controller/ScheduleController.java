package com.iwp2.backend.controller;

import com.iwp2.backend.dto.schedule.ClassroomSchedule;
import com.iwp2.backend.service.ScheduleService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/classrooms")
public class ScheduleController {

	private final ScheduleService scheduleService;

	public ScheduleController(ScheduleService scheduleService) {
		this.scheduleService = scheduleService;
	}

	@GetMapping("/{id}/schedule")
	public ClassroomSchedule getSchedule(
			@PathVariable Long id,
			@RequestParam Integer week) {

		return scheduleService.getClassroomSchedule(id, week);
	}
}