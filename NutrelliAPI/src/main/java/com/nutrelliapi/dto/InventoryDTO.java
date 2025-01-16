package com.nutrelliapi.dto;

import com.nutrelliapi.model.MeasurementUnit;

public class InventoryDTO {
    private Integer id;
    private String name;
    private Double quantity;
    private MeasurementUnit measurementUnit;
    private Double minimumQuantity;

    public InventoryDTO() {}

    public InventoryDTO(Integer id, String name, Double quantity, MeasurementUnit measurementUnit, Double minimumQuantity) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.measurementUnit = measurementUnit;
        this.minimumQuantity = minimumQuantity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public MeasurementUnit getMeasurementUnit() {
        return measurementUnit;
    }

    public void setMeasurementUnit(MeasurementUnit measurementUnit) {
        this.measurementUnit = measurementUnit;
    }

    public Double getMinimumQuantity() {
        return minimumQuantity;
    }

    public void setMinimumQuantity(Double minimumQuantity) {
        this.minimumQuantity = minimumQuantity;
    }
}
