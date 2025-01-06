package com.nutrelliapi.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String customer;

    @Column(name = "data_pedido")
    private LocalDate orderDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pedido")
    private OrderStatus orderStatus;

    @Column(name = "valor_total")
    private Double totalValue;

    @ManyToOne
    @JoinColumn(name = "id_tipo_pagamento")
    private PaymentType paymentType;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductOrdered> orderedProducts;

    public Order(Integer id, String customer, LocalDate orderDate, OrderStatus orderStatus, Double totalValue, PaymentType paymentType, List<ProductOrdered> orderedProducts) {
        this.id = id;
        this.customer = customer;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalValue = totalValue;
        this.paymentType = paymentType;
        this.orderedProducts = orderedProducts;
    }

    public Order() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(Double totalValue) {
        this.totalValue = totalValue;
    }

    public PaymentType getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }

    public List<ProductOrdered> getOrderedProducts() {
        return orderedProducts;
    }

    public void setOrderedProducts(List<ProductOrdered> productOrdereds) {
        this.orderedProducts = productOrdereds;
    }
}
