package com.nutrelliapi.dto;

import com.nutrelliapi.model.Order;

import java.time.LocalDate;
import java.util.List;

public class OrderDTO {
    private Integer id;
    private String customer;
    private LocalDate orderDate;
    private String orderStatus;
    private Double totalValue;
    private PaymentTypeDTO paymentType;
    private List<OrderedProductDTO> orderedProducts;

    public OrderDTO() {
    }

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.customer = order.getCustomer();
        this.orderDate = order.getOrderDate();
        this.orderStatus = order.getOrderStatus().toString();
        this.totalValue = order.getTotalValue();
        this.paymentType = order.getPaymentType() != null ? new PaymentTypeDTO(order.getPaymentType()) : null;
        this.orderedProducts = order.getOrderedProducts().stream().map(OrderedProductDTO::new).toList();
    }

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

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(Double totalValue) {
        this.totalValue = totalValue;
    }

    public PaymentTypeDTO getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentTypeDTO paymentType) {
        this.paymentType = paymentType;
    }

    public List<OrderedProductDTO> getOrderedProducts() {
        return orderedProducts;
    }

    public void setOrderedProducts(List<OrderedProductDTO> orderedProducts) {
        this.orderedProducts = orderedProducts;
    }
}
