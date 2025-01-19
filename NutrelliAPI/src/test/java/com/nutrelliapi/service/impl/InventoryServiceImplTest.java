package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.InventoryNotFoundException;
import com.nutrelliapi.model.Inventory;
import com.nutrelliapi.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class InventoryServiceImplTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private InventoryServiceImpl inventoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllInventory() {
        Inventory inventory = new Inventory();
        when(inventoryRepository.findAll()).thenReturn(List.of(inventory));

        List<Inventory> result = inventoryService.findAllInventory();

        assertEquals(1, result.size());
        verify(inventoryRepository, times(1)).findAll();
    }

    @Test
    void testFindAllInventoryPage() {
        Inventory inventory = new Inventory();
        Page<Inventory> page = new PageImpl<>(List.of(inventory));
        Pageable pageable = PageRequest.of(0, 10);
        when(inventoryRepository.findAll(pageable)).thenReturn(page);

        Page<Inventory> result = inventoryService.findAllInventoryPage(pageable);

        assertEquals(1, result.getTotalElements());
        verify(inventoryRepository, times(1)).findAll(pageable);
    }

    @Test
    void testFindInventoryById() {
        Inventory inventory = new Inventory();
        when(inventoryRepository.findById(anyInt())).thenReturn(Optional.of(inventory));

        Inventory result = inventoryService.findInventoryById(1);

        assertNotNull(result);
        verify(inventoryRepository, times(1)).findById(1);
    }

    @Test
    void testFindInventoryByIdNotFound() {
        when(inventoryRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(InventoryNotFoundException.class, () -> inventoryService.findInventoryById(1));
    }

    @Test
    void testSaveInventory() {
        Inventory inventory = new Inventory();
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);

        Inventory result = inventoryService.saveInventory(inventory);

        assertNotNull(result);
        verify(inventoryRepository, times(1)).save(inventory);
    }

    @Test
    void testUpdateInventory() {
        Inventory existingInventory = new Inventory();
        Inventory updatedInventory = new Inventory();
        when(inventoryRepository.findById(anyInt())).thenReturn(Optional.of(existingInventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(updatedInventory);

        Inventory result = inventoryService.updateInventory(1, updatedInventory);

        assertNotNull(result);
        verify(inventoryRepository, times(1)).findById(1);
        verify(inventoryRepository, times(1)).save(existingInventory);
    }

    @Test
    void testUpdateQuantity() {
        Inventory inventory = new Inventory();
        when(inventoryRepository.findById(anyInt())).thenReturn(Optional.of(inventory));

        inventoryService.updateQuantity(1, 10.0);

        assertEquals(10.0, inventory.getQuantity());
        verify(inventoryRepository, times(1)).findById(1);
        verify(inventoryRepository, times(1)).save(inventory);
    }

    @Test
    void testDeleteInventory() {
        when(inventoryRepository.findById(anyInt())).thenReturn(Optional.of(new Inventory()));

        inventoryService.deleteInventory(1);

        verify(inventoryRepository, times(1)).findById(1);
        verify(inventoryRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeleteInventoryNotFound() {
        when(inventoryRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(InventoryNotFoundException.class, () -> inventoryService.deleteInventory(1));
    }
}