package com.iwp2.backend.service;

import com.iwp2.backend.entity.Classroom;
import com.iwp2.backend.repository.ClassroomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {

    private final ClassroomRepository classroomRepository;

    public ClassroomService(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    public List<Classroom> getClassroomsByFloor(Long floorId) {
        return classroomRepository.findByFloorId(floorId);
    }
}