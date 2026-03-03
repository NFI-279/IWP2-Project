package com.iwp2.backend.controller;

import com.iwp2.backend.entity.Classroom;
import com.iwp2.backend.service.ClassroomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/floors")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @GetMapping("/{floorId}/classrooms")
    public List<Classroom> getClassroomsByFloor(@PathVariable Long floorId) {
        return classroomService.getClassroomsByFloor(floorId);
    }
}