package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.OrderNotFoundException;
import com.nutrelliapi.model.Order;
import com.nutrelliapi.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order findOrderById(Integer id) {
        return orderRepository.findById(id).orElseThrow(() -> new OrderNotFoundException("Pedido não encontrado"));
    }

    @Override
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Integer id, Order order) {
        return orderRepository.findById(id)
                .map(existingOrder -> {
                    order.setId(id);
                    return orderRepository.save(order);
                }).orElseThrow(() -> new OrderNotFoundException("Pedido não encontrado"));
    }

    @Override
    public void deleteOrder(Integer id) {
        if (orderRepository.findById(id).isEmpty()) {
            throw new OrderNotFoundException("Pedido não encontrado");
        }
        orderRepository.deleteById(id);
    }
}
