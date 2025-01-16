package com.nutrelliapi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "estoque")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "quantidade")
    private Double quantity;

    @Column(name = "unidade_medida")
    @Enumerated(EnumType.STRING)
    private MeasurementUnit measurementUnit;

    @Column(name = "quantidade_minima")
    private Double minimumQuantity;

    public Inventory() {}

    public Inventory(Integer id, String nome, Double quantity, MeasurementUnit measurementUnit, Double minimumQuantity) {
        this.id = id;
        this.nome = nome;
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

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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
