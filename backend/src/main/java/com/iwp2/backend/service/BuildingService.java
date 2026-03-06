package com.iwp2.backend.service;

import com.iwp2.backend.entity.Building;
import com.iwp2.backend.repository.BuildingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuildingService {

	private final BuildingRepository buildingRepository;

	public BuildingService(BuildingRepository buildingRepository) {
		this.buildingRepository = buildingRepository;
	}

	public List<Building> getAllBuildings() {
		return buildingRepository.findAll();
	}

	public Building createBuilding(Building building) {
		return buildingRepository.save(building);
	}

	public void deleteBuilding(Long id) {
		buildingRepository.deleteById(id);
	}
}