package com.iwp2.backend.controller.admin;

import com.iwp2.backend.entity.Classroom;
import com.iwp2.backend.service.ClassroomService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.iwp2.backend.dto.ClassroomCoordinates;

@RestController
@RequestMapping("/admin/classrooms")
@PreAuthorize("hasRole('ADMIN')")
public class AdminClassroomController {

	private final ClassroomService classroomService;

	public AdminClassroomController(ClassroomService classroomService) {
		this.classroomService = classroomService;
	}

	@PostMapping("/{floorId}")
	public Classroom create(@PathVariable Long floorId,
			@RequestBody Classroom classroom) {
		return classroomService.createClassroom(floorId, classroom);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		classroomService.deleteClassroom(id);
	}

	@PutMapping("/{id}/coordinates")
	public Classroom updateCoordinates(
			@PathVariable Long id,
			@RequestBody ClassroomCoordinates dto) {

		return classroomService.updateCoordinates(
				id,
				dto.getTopLeftX(),
				dto.getTopLeftY(),
				dto.getBottomRightX(),
				dto.getBottomRightY());
	}
}