package com.nutrelliapi.controller;

import com.nutrelliapi.dto.InventoryDTO;
import com.nutrelliapi.mapper.InventoryMapper;
import com.nutrelliapi.model.Inventory;
import com.nutrelliapi.service.InventoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;
    private final InventoryMapper inventoryMapper;

    public InventoryController(InventoryService inventoryService, InventoryMapper inventoryMapper) {
        this.inventoryService = inventoryService;
        this.inventoryMapper = inventoryMapper;
    }

    @GetMapping
    public ResponseEntity<List<InventoryDTO>> findAllInventory() {
        List<InventoryDTO> inventory = inventoryService.findAllInventory()
                .stream()
                .map(inventoryMapper::toDTO)
                .toList();
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryDTO> findInventoryById(@PathVariable Integer id) {
        Inventory inventory = inventoryService.findInventoryById(id);
        return ResponseEntity.ok(inventoryMapper.toDTO(inventory));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<InventoryDTO>> findAllInventoryPage(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) boolean lowStock) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Inventory> inventory;

        if (lowStock) {
            inventory = inventoryService.findLowStockItems(pageable);
        } else if (name != null && !name.isEmpty()) {
            inventory = inventoryService.findInventoryByNameContaining(name, pageable);
        } else {
            inventory = inventoryService.findAllInventoryPage(pageable);
        }

        return ResponseEntity.ok(inventory.map(inventoryMapper::toDTO));
    }

    @PostMapping("/add")
    public ResponseEntity<InventoryDTO> saveInventory(@Valid @RequestBody InventoryDTO inventoryDTO) {
        Inventory inventory = inventoryMapper.toEntity(inventoryDTO);
        Inventory savedInventory = inventoryService.saveInventory(inventory);
        return new ResponseEntity<>(inventoryMapper.toDTO(savedInventory),HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<InventoryDTO> updateInventory(
            @PathVariable Integer id,
            @Valid @RequestBody InventoryDTO inventoryDTO) {
        Inventory inventory = inventoryMapper.toEntity(inventoryDTO);
        Inventory updatedInventory = inventoryService.updateInventory(id, inventory);
        return ResponseEntity.ok(inventoryMapper.toDTO(updatedInventory));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<InventoryDTO> updateQuantity(
            @PathVariable Integer id,
            @RequestParam @Min(0) Double quantity) {
        inventoryService.updateQuantity(id, quantity);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Integer id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}
