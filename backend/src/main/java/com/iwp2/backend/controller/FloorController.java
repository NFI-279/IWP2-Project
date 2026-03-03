package com.iwp2.backend.controller;

import com.iwp2.backend.entity.Floor;
import com.iwp2.backend.service.FloorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buildings")
public class FloorController {

    private final FloorService floorService;

    public FloorController(FloorService floorService) {
        this.floorService = floorService;
    }

    @GetMapping("/{buildingId}/floors")
    public List<Floor> getFloorsByBuilding(@PathVariable Long buildingId) {
        return floorService.getFloorsByBuilding(buildingId);
    }
}