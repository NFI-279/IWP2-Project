package com.iwp2.backend.controller.admin;

import com.iwp2.backend.entity.Building;
import com.iwp2.backend.service.BuildingService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/buildings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBuildingController {

	private final BuildingService buildingService;

	public AdminBuildingController(BuildingService buildingService) {
		this.buildingService = buildingService;
	}

	@PostMapping
	public Building create(@RequestBody Building building) {
		return buildingService.createBuilding(building);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		buildingService.deleteBuilding(id);
	}
}