package com.nutrelliapi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "produto_categoria")
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome")
    private String name;

    public ProductCategory(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public ProductCategory() {}

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
}
