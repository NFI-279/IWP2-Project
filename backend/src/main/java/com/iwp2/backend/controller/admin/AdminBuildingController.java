package com.iwp2.backend.controller.admin;

import com.iwp2.backend.entity.Building;
import com.iwp2.backend.service.BuildingService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

	@PostMapping("/upload")
	public Building uploadBuilding(
			@RequestParam("name") String name,
			@RequestParam("file") MultipartFile file) throws IOException {

		String uploadDir = "uploads/";

		File dir = new File(uploadDir);
		if (!dir.exists())
			dir.mkdirs();

		String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
		Path path = Paths.get(uploadDir + filename);

		Files.write(path, file.getBytes());

		Building building = new Building();
		building.setName(name);
		building.setImagePath("/uploads/" + filename);

		return buildingService.createBuilding(building);
	}
}