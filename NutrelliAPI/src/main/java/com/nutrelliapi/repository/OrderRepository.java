package com.nutrelliapi.repository;

import com.nutrelliapi.model.Order;
import com.nutrelliapi.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Page<Order> findOrdersByCustomerContainingIgnoreCase(String customer, Pageable pageable);
    Page<Order> findOrderByOrderStatus(OrderStatus orderStatus, Pageable pageable);
}
