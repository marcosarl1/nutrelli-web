package com.nutrelliapi.controller;

import com.nutrelliapi.model.OrderStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders/status")
public class OrderStatusController {

    @GetMapping()
    public ResponseEntity<List<Map<String, String>>> getAllOrderStatus() {
        List<Map<String, String>> statusList = Arrays.stream(OrderStatus.values())
                .map(status -> Map.of
                        ("name", status.name(), "description", status.toString()))
                .toList();
        return ResponseEntity.ok(statusList);
    }
}
