package com.iwp2.backend.controller.admin;

import com.iwp2.backend.entity.Floor;
import com.iwp2.backend.service.FloorService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

	@PostMapping("/{buildingId}/upload")
	public Floor uploadFloor(
			@PathVariable Long buildingId,
			@RequestParam("name") String name,
			@RequestParam("file") MultipartFile file) throws IOException {

		String uploadDir = "uploads/";

		File dir = new File(uploadDir);
		if (!dir.exists())
			dir.mkdirs();

		String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
		Path path = Paths.get(uploadDir + filename);

		Files.write(path, file.getBytes());

		Floor floor = new Floor();
		floor.setName(name);
		floor.setImagePath("/uploads/" + filename);

		return floorService.createFloor(buildingId, floor);
	}
}