package com.nutrelliapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "estoque")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome")
    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 100, message = "O nome do item deve ter no máximo 100 caracteres")
    private String name;

    @Column(name = "quantidade")
    @NotNull(message = "A quantidade é obrigatória")
    @PositiveOrZero(message = "A quantidade deve ser um número positivo")
    private Double quantity;

    @Column(name = "unidade_medida")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "A unidade de medida é obrigatória")
    private MeasurementUnit measurementUnit;

    @Column(name = "quantidade_minima")
    @NotNull(message = "A quantidade mínima é obrigatória")
    @PositiveOrZero(message = "A quantidade mínima deve ser um número positivo")
    private Double minimumQuantity;

    public Inventory() {}

    public Inventory(Integer id, String name, Double quantity, MeasurementUnit measurementUnit, Double minimumQuantity) {
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
