package com.iwp2.backend.controller;

import com.iwp2.backend.entity.Floor;
import com.iwp2.backend.service.FloorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FloorController {

	private final FloorService floorService;

	public FloorController(FloorService floorService) {
		this.floorService = floorService;
	}

	@GetMapping("/buildings/{buildingId}/floors")
	public List<Floor> getFloorsByBuilding(@PathVariable Long buildingId) {
		return floorService.getFloorsByBuilding(buildingId);
	}

	@GetMapping("/floors/{id}")
	public Floor getFloor(@PathVariable Long id) {
		return floorService.getFloor(id);
	}
}