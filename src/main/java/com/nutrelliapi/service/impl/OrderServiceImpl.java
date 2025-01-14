package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.OrderNotFoundException;
import com.nutrelliapi.exception.PaymentTypeNotFoundException;
import com.nutrelliapi.exception.ProductNotFoundException;
import com.nutrelliapi.model.*;
import com.nutrelliapi.repository.OrderRepository;
import com.nutrelliapi.repository.PaymentTypeRepository;
import com.nutrelliapi.repository.ProductRepository;
import com.nutrelliapi.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PaymentTypeRepository paymentTypeRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, PaymentTypeRepository paymentTypeRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.paymentTypeRepository = paymentTypeRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Page<Order> findAllOrdersPage(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Override
    public Page<Order> findOrdersByCustomerContainingIgnoreCase(String customer, Pageable pageable) {
        return orderRepository.findOrdersByCustomerContainingIgnoreCase(customer, pageable);
    }

    @Override
    public Page<Order> findOrderByOrderStatus(OrderStatus orderStatus, Pageable pageable) {
        return orderRepository.findOrderByOrderStatus(orderStatus, pageable);
    }

    @Override
    public Order findOrderById(Integer id) {
        return orderRepository.findById(id).orElseThrow(() -> new OrderNotFoundException("Pedido não encontrado"));
    }

    @Override
    public Order saveOrder(Order order) {
        validatePaymentType(order);
        setDefaultOrderStatus(order);
        validateOrderedProducts(order);
        calculateTotalValue(order);
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Integer id, Order order) {
        Order existingOrder = findOrderById(id);
        updateExistingOrder(existingOrder, order);
        calculateTotalValue(existingOrder);
        return orderRepository.save(existingOrder);
    }

    @Override
    public void deleteOrder(Integer id) {
        if (orderRepository.findById(id).isEmpty()) {
            throw new OrderNotFoundException("Pedido não encontrado");
        }
        orderRepository.deleteById(id);
    }

    private void validatePaymentType(Order order) {
        if (order.getPaymentType() != null) {
            PaymentType paymentType = paymentTypeRepository
                    .findById(order.getPaymentType().getId())
                    .orElseThrow(() -> new PaymentTypeNotFoundException("Tipo de pagamento não encontrado"));
            order.setPaymentType(paymentType);
        }
    }

    private void setDefaultOrderStatus(Order order) {
        order.setOrderStatus(OrderStatus.PENDENTE);
    }

    private void validateOrderedProducts(Order order) {
        if (order.getOrderedProducts() != null) {
            for (OrderedProduct orderedProduct : order.getOrderedProducts()) {
                Product product = productRepository
                        .findById(orderedProduct.getProduct().getId())
                        .orElseThrow(() -> new ProductNotFoundException("Produto não encontrado"));
                orderedProduct.setProduct(product);
                orderedProduct.setOrder(order);
            }
        }
    }

    private void updateExistingOrder(Order existingOrder, Order order) {
        existingOrder.setCustomer(order.getCustomer());
        existingOrder.setOrderStatus(order.getOrderStatus());
        validatePaymentType(order);
        existingOrder.getOrderedProducts().clear();
        validateOrderedProducts(order);
        existingOrder.getOrderedProducts().addAll(order.getOrderedProducts());
    }

    private void calculateTotalValue(Order order) {
        double total = order.getOrderedProducts()
                .stream()
                .mapToDouble(op -> op.getQuantity() * op.getProduct().getPrice())
                .sum();
        order.setTotalValue(total);
    }
}
