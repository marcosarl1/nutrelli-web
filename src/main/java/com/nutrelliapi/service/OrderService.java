package com.nutrelliapi.service;

import com.nutrelliapi.model.Order;

import java.util.List;

public interface OrderService {
    List<Order> findAllOrders();
    Order findOrderById(Integer id);
    Order saveOrder(Order order);
    Order updateOrder(Integer id, Order order);
    void deleteOrder(Integer id);
}
