package com.iwp2.backend.service;

import com.iwp2.backend.entity.Classroom;
import com.iwp2.backend.entity.Floor;
import com.iwp2.backend.repository.ClassroomRepository;
import com.iwp2.backend.repository.FloorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {

	private final ClassroomRepository classroomRepository;
	private final FloorRepository floorRepository;

	public ClassroomService(ClassroomRepository classroomRepository,
			FloorRepository floorRepository) {
		this.classroomRepository = classroomRepository;
		this.floorRepository = floorRepository;
	}

	public List<Classroom> getClassroomsByFloor(Long floorId) {
		return classroomRepository.findByFloorId(floorId);
	}

	public Classroom createClassroom(Long floorId, Classroom classroom) {

		Floor floor = floorRepository.findById(floorId)
				.orElseThrow(() -> new RuntimeException("Floor not found"));

		classroom.setFloor(floor);

		return classroomRepository.save(classroom);
	}

	public void deleteClassroom(Long id) {
		classroomRepository.deleteById(id);
	}

	public Classroom updateCoordinates(
			Long id,
			Double topLeftX,
			Double topLeftY,
			Double bottomRightX,
			Double bottomRightY) {

		Classroom classroom = classroomRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Classroom not found"));

		classroom.setTopLeftX(topLeftX);
		classroom.setTopLeftY(topLeftY);
		classroom.setBottomRightX(bottomRightX);
		classroom.setBottomRightY(bottomRightY);

		return classroomRepository.save(classroom);
	}
}