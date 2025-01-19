package com.nutrelliapi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "produto")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "nome")
    private String name;
    
    @Column(name = "preco")
    private Double price = 0.0;
    
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private ProductCategory productCategory;

    @Column(name = "disponibilidade")
    private boolean available = true;

    @Column(name = "imagem")
    private byte[] image;

    public Product(Integer id, String name, Double price, ProductCategory productCategory, boolean available, byte[] image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.productCategory = productCategory;
        this.available = available;
        this.image = image;
    }

    public Product() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String nome) {
        this.name = nome;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public ProductCategory getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(ProductCategory productCategory) {
        this.productCategory = productCategory;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
