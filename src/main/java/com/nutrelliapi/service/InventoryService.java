package com.nutrelliapi.service;

import com.nutrelliapi.model.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InventoryService {
    List<Inventory> findAllInventory();
    Page<Inventory> findAllInventoryPage(Pageable pageable);
    Page<Inventory> findInventoryByNameContaining(String name, Pageable pageable);
    Page<Inventory> findLowStockItems(Pageable pageable);
    Inventory findInventoryById(Integer id);
    Inventory saveInventory(Inventory inventory);
    Inventory updateInventory(Integer id, Inventory inventory);
    void deleteInventory(Integer id);
}
