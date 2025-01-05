package com.nutrelliapi.repository;

import com.nutrelliapi.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Integer, Order> {
}
