package com.nutrelliapi.repository;

import com.nutrelliapi.model.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    Page<Inventory> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT i FROM Inventory i WHERE i.quantity < i.minimumQuantity")
    Page<Inventory> findLowStockItems(Pageable pageable);
}
