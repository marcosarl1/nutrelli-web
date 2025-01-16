package com.nutrelliapi.mapper;

import com.nutrelliapi.dto.OrderDTO;
import com.nutrelliapi.dto.OrderedProductDTO;
import com.nutrelliapi.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public Order toEntity(OrderDTO orderDTO) {
        if (orderDTO == null) {
            return null;
        }

        Order order = new Order();
        order.setId(orderDTO.getId());
        order.setCustomer(orderDTO.getCustomer());
        order.setOrderDate(orderDTO.getOrderDate());
        order.setOrderStatus(orderDTO.getOrderStatus() != null ? OrderStatus.valueOf(orderDTO.getOrderStatus()) : null);
        order.setTotalValue(orderDTO.getTotalValue());

        if (orderDTO.getPaymentType() != null) {
            PaymentType paymentType = new PaymentType();
            paymentType.setId(orderDTO.getPaymentType().getId());
            paymentType.setName(orderDTO.getPaymentType().getName());
            order.setPaymentType(paymentType);
        }

        if (orderDTO.getOrderedProducts() != null) {
            List<OrderedProduct> orderedProducts = orderDTO.getOrderedProducts()
                    .stream()
                    .map(dto -> toOrderedProductEntity(dto, order))
                    .collect(Collectors.toList());
            order.setOrderedProducts(orderedProducts);
        }
        return order;
    }

    public OrderDTO toDto(Order order) {
        if (order == null) {
            return null;
        }
        return new OrderDTO(order);
    }

    private OrderedProduct toOrderedProductEntity(OrderedProductDTO dto, Order order) {
        if (dto == null) {
            return null;
        }

        OrderedProduct orderedProduct = new OrderedProduct();
        orderedProduct.setId(dto.getId());
        orderedProduct.setOrder(order);
        Product product = new Product();
        product.setId(dto.getProductId());
        product.setName(dto.getProductName());
        orderedProduct.setProduct(product);
        orderedProduct.setQuantity(dto.getQuantity());

        return orderedProduct;
    }
}
