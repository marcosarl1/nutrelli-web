package com.nutrelliapi.repository;

import com.nutrelliapi.model.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    Page<Inventory> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Inventory> findByQuantityIsLessThan(Double minimumQuantity, Pageable pageable);
}
