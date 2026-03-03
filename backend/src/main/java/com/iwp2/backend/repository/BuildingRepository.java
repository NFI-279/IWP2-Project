package com.iwp2.backend.repository;

import com.iwp2.backend.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuildingRepository extends JpaRepository<Building, Long> {
}