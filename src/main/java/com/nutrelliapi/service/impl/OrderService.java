package com.nutrelliapi.service.impl;

import com.nutrelliapi.model.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> findAllOrders();
    Optional<Order> findOrderById(Integer id);
    Order saveOrder(Order order);
    Order updateOrder(Integer id, Order order);
    void deleteOrder(Integer id);
}
