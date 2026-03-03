package com.iwp2.backend.repository;

import com.iwp2.backend.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {

    List<Classroom> findByFloorId(Long floorId);
}