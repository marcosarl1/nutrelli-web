package com.nutrelliapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "O nome do client é obrigatório")
    private String customer;

    @Column(name = "data_pedido")
    @NotNull(message = "A data de entrega do pedido é obrigatória")
    @FutureOrPresent(message = "A data de entrega do pedido deve ser no presente ou no futuro")
    private LocalDate orderDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pedido")
    @NotNull(message = "O status do pedido é obrigatório")
    private OrderStatus orderStatus;

    @Column(name = "valor_total")
    @NotNull(message = "O valor total do pedido é obrigatório")
    @PositiveOrZero(message = "O valor total do pedido deve ser positivo ou zero")
    private Double totalValue;

    @ManyToOne
    @JoinColumn(name = "id_tipo_pagamento")
    @NotNull(message = "O tipo de pagamento é obrigatório")
    private PaymentType paymentType;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @NotEmpty(message = "O pedido deve conter pelo menos um produto")
    private List<OrderedProduct> orderedProducts;

    public Order(Integer id, String customer, LocalDate orderDate, OrderStatus orderStatus, Double totalValue, PaymentType paymentType, List<OrderedProduct> orderedProducts) {
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

    public List<OrderedProduct> getOrderedProducts() {
        return orderedProducts;
    }

    public void setOrderedProducts(List<OrderedProduct> productOrdereds) {
        this.orderedProducts = productOrdereds;
    }
}
