package com.nutrelliapi.mapper;

import com.nutrelliapi.dto.InventoryDTO;
import com.nutrelliapi.model.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryDTO toDTO(Inventory inventory) {
        if (inventory == null) {
            return null;
        }

        InventoryDTO dto = new InventoryDTO();
        dto.setId(inventory.getId());
        dto.setName(inventory.getName());
        dto.setQuantity(inventory.getQuantity());
        dto.setMeasurementUnit(inventory.getMeasurementUnit());
        dto.setMinimumQuantity(inventory.getMinimumQuantity());

        return dto;
    }

    public Inventory toEntity(InventoryDTO dto) {
        if (dto == null) {
            return null;
        }

        Inventory inventory = new Inventory();
        inventory.setId(dto.getId());
        inventory.setName(dto.getName());
        inventory.setQuantity(dto.getQuantity());
        inventory.setMeasurementUnit(dto.getMeasurementUnit());
        inventory.setMinimumQuantity(dto.getMinimumQuantity());

        return inventory;
    }
}
