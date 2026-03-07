package com.iwp2.backend.service;

import com.iwp2.backend.entity.Building;
import com.iwp2.backend.entity.Floor;
import com.iwp2.backend.repository.BuildingRepository;
import com.iwp2.backend.repository.FloorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FloorService {

	private final FloorRepository floorRepository;
	private final BuildingRepository buildingRepository;

	public FloorService(FloorRepository floorRepository,
			BuildingRepository buildingRepository) {
		this.floorRepository = floorRepository;
		this.buildingRepository = buildingRepository;
	}

	public List<Floor> getFloorsByBuilding(Long buildingId) {
		return floorRepository.findByBuildingId(buildingId);
	}

	public Floor createFloor(Long buildingId, Floor floor) {
		Building building = buildingRepository.findById(buildingId)
				.orElseThrow();

		floor.setBuilding(building);

		return floorRepository.save(floor);
	}

	public void deleteFloor(Long id) {
		floorRepository.deleteById(id);
	}

	public Floor getFloor(Long id) {
		return floorRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Floor not found"));
	}
}