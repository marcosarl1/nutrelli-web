package com.nutrelliapi.service;

import com.nutrelliapi.model.Order;
import com.nutrelliapi.model.OrderStatus;

import java.util.List;

public interface OrderService {
    List<Order> findAllOrders();
    Order findOrderById(Integer id);
    Order saveOrder(Order order);
    Order updateOrder(Integer id, Order order);
    Order updateOrderStatus(Integer id, OrderStatus orderStatus);
    void deleteOrder(Integer id);
}
