package com.nutrelliapi.controller;

import com.nutrelliapi.model.MeasurementUnit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/measurement-unit")
public class MeasurementUnitController {

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAllMeasureUnits() {
        List<Map<String, String>> measureUnits = Arrays
                .stream(MeasurementUnit.values())
                .map(unit -> Map.of("name", unit.name()))
                .toList();
        return ResponseEntity.ok(measureUnits);
    }
}
