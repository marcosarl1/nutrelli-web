package com.nutrelliapi.dto;

import com.nutrelliapi.model.OrderedProduct;

public class OrderedProductDTO {
    private Integer id;
    private Integer productId;
    private String productName;
    private int quantity;

    public OrderedProductDTO() {}

    public OrderedProductDTO(OrderedProduct orderedProduct) {
        this.id = orderedProduct.getId();
        this.productId = orderedProduct.getProduct().getId();
        this.productName = orderedProduct.getProduct().getName();
        this.quantity = orderedProduct.getQuantity();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
