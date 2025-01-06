package com.nutrelliapi.service.impl;

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
    public Optional<Order> findOrderById(Integer id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Integer id, Order order) {
        Optional<Order> originalOrder = findOrderById(id);
        if (originalOrder.isPresent()) {
            Order orderToUpdate = originalOrder.get();
            orderToUpdate.setCustomer(order.getCustomer());
            orderToUpdate.setOrderDate(order.getOrderDate());
            orderToUpdate.setOrderStatus(order.getOrderStatus());
            orderToUpdate.setTotalValue(order.getTotalValue());
            orderToUpdate.setPaymentType(order.getPaymentType());
            orderToUpdate.setProductOrdereds(order.getProductOrdereds());
            return orderRepository.save(orderToUpdate);
        }
        return null;
    }

    @Override
    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }
}
