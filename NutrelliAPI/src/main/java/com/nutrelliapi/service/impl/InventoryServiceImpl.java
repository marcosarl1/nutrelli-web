package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.InventoryNotFoundException;
import com.nutrelliapi.model.Inventory;
import com.nutrelliapi.repository.InventoryRepository;
import com.nutrelliapi.service.InventoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public List<Inventory> findAllInventory() {
        return inventoryRepository.findAll();
    }

    @Override
    public Page<Inventory> findAllInventoryPage(Pageable pageable) {
        return inventoryRepository.findAll(pageable);
    }

    @Override
    public Page<Inventory> findInventoryByNameContaining(String name, Pageable pageable) {
        return inventoryRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    @Override
    public Page<Inventory> findLowStockItems(Pageable pageable) {
        return inventoryRepository.findLowStockItems(pageable);
    }

    @Override
    public Inventory findInventoryById(Integer id) {
        return inventoryRepository.findById(id).orElseThrow(() -> new InventoryNotFoundException("Item do estoque não encontrado"));
    }

    @Override
    public Inventory saveInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Override
    public Inventory updateInventory(Integer id, Inventory inventory) {
        Inventory existingInventory = findInventoryById(id);
        updateExistingInventory(existingInventory, inventory);
        return inventoryRepository.save(existingInventory);
    }

    @Override
    public void deleteInventory(Integer id) {
        if (inventoryRepository.findById(id).isEmpty()) {
            throw new InventoryNotFoundException("Item do estoque não encontrado");
        }
        inventoryRepository.deleteById(id);
    }

    private void updateExistingInventory(Inventory existingInventory, Inventory inventory) {
        existingInventory.setName(inventory.getName());
        existingInventory.setQuantity(inventory.getQuantity());
        existingInventory.setMeasurementUnit(inventory.getMeasurementUnit());
        existingInventory.setMinimumQuantity(inventory.getMinimumQuantity());
    }
}
