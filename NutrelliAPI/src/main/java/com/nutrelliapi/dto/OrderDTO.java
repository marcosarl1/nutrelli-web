package com.nutrelliapi.dto;

import com.nutrelliapi.model.Order;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public class OrderDTO {
    private Integer id;

    @NotBlank(message = "O nome do client é obrigatório")
    @Size(max = 100, message = "O nome do cliente deve ter no máximo 100 caracteres")
    private String customer;

    @NotNull(message = "A data de entrega do pedido é obrigatória")
    @FutureOrPresent(message = "A data de entrega do pedido deve ser no presente ou no futuro")
    private LocalDate orderDate;

    @NotBlank(message = "O status do pedido é obrigatório")
    private String orderStatus;

    @NotNull(message = "O valor total do pedido é obrigatório")
    @PositiveOrZero(message = "O valor total do pedido deve ser positivo ou zero")
    private Double totalValue;

    @NotNull(message = "O tipo de pagamento é obrigatório")
    private PaymentTypeDTO paymentType;

    @NotEmpty(message = "O pedido deve conter pelo menos um produto")
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
