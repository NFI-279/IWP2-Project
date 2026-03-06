package com.iwp2.backend.controller.admin;

import com.iwp2.backend.entity.Floor;
import com.iwp2.backend.service.FloorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/floors")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFloorController {

	private final FloorService floorService;

	public AdminFloorController(FloorService floorService) {
		this.floorService = floorService;
	}

	@PostMapping("/{buildingId}")
	public Floor create(@PathVariable Long buildingId,
			@RequestBody Floor floor) {
		return floorService.createFloor(buildingId, floor);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		floorService.deleteFloor(id);
	}
}