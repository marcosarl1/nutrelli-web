package com.nutrelliapi.service;

import com.nutrelliapi.model.Order;
import com.nutrelliapi.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    List<Order> findAllOrders();
    Order findOrderById(Integer id);
    Page<Order> findAllOrdersPage(Pageable pageable);
    Page<Order> findOrdersByCustomerContainingIgnoreCase(String customer, Pageable pageable);
    Page<Order> findOrderByOrderStatus(OrderStatus orderStatus, Pageable pageable);
    Order saveOrder(Order order);
    Order updateOrder(Integer id, Order order);
    void deleteOrder(Integer id);
}
