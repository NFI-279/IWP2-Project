package com.iwp2.backend.repository;

import com.iwp2.backend.entity.Building;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Long> {
	List<Building> findTop3ByOrderByCreatedAtDesc();
}