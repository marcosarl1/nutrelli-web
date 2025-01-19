package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.OrderNotFoundException;
import com.nutrelliapi.exception.PaymentTypeNotFoundException;
import com.nutrelliapi.exception.ProductNotFoundException;
import com.nutrelliapi.model.*;
import com.nutrelliapi.repository.OrderRepository;
import com.nutrelliapi.repository.PaymentTypeRepository;
import com.nutrelliapi.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentTypeRepository paymentTypeRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllOrders() {
        Order order = new Order();
        when(orderRepository.findAll()).thenReturn(List.of(order));

        List<Order> result = orderService.findAllOrders();

        assertEquals(1, result.size());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void testFindAllOrdersPage() {
        Order order = new Order();
        Page<Order> page = new PageImpl<>(List.of(order));
        Pageable pageable = PageRequest.of(0, 10);
        when(orderRepository.findAll(pageable)).thenReturn(page);

        Page<Order> result = orderService.findAllOrdersPage(pageable);

        assertEquals(1, result.getTotalElements());
        verify(orderRepository, times(1)).findAll(pageable);
    }

    @Test
    void testFindOrdersByCustomerContainingIgnoreCase() {
        Order order = new Order();
        Page<Order> page = new PageImpl<>(List.of(order));
        Pageable pageable = PageRequest.of(0, 10);
        when(orderRepository.findOrdersByCustomerContainingIgnoreCase(anyString(), eq(pageable))).thenReturn(page);

        Page<Order> result = orderService.findOrdersByCustomerContainingIgnoreCase("customer", pageable);

        assertEquals(1, result.getTotalElements());
        verify(orderRepository, times(1)).findOrdersByCustomerContainingIgnoreCase("customer", pageable);
    }

    @Test
    void testFindOrderByOrderStatus() {
        Order order = new Order();
        Page<Order> page = new PageImpl<>(List.of(order));
        Pageable pageable = PageRequest.of(0, 10);
        when(orderRepository.findOrderByOrderStatus(any(OrderStatus.class), eq(pageable))).thenReturn(page);

        Page<Order> result = orderService.findOrderByOrderStatus(OrderStatus.PENDENTE, pageable);

        assertEquals(1, result.getTotalElements());
        verify(orderRepository, times(1)).findOrderByOrderStatus(OrderStatus.PENDENTE, pageable);
    }

    @Test
    void testFindOrderById() {
        Order order = new Order();
        when(orderRepository.findById(anyInt())).thenReturn(Optional.of(order));

        Order result = orderService.findOrderById(1);

        assertNotNull(result);
        verify(orderRepository, times(1)).findById(1);
    }

    @Test
    void testFindOrderByIdNotFound() {
        when(orderRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> orderService.findOrderById(1));
    }

    @Test
    void testSaveOrder() {
        Order order = new Order();
        PaymentType paymentType = new PaymentType();
        Product product = new Product();
        product.setId(1);
        OrderedProduct orderedProduct = new OrderedProduct();
        orderedProduct.setProduct(product);
        order.setOrderedProducts(List.of(orderedProduct));
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.of(paymentType));
        when(productRepository.findById(anyInt())).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order result = orderService.saveOrder(order);

        assertNotNull(result);
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testSaveOrderPaymentTypeNotFound() {
        Order order = new Order();
        PaymentType paymentType = new PaymentType();
        order.setPaymentType(paymentType);
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(PaymentTypeNotFoundException.class, () -> orderService.saveOrder(order));
    }

    @Test
    void testSaveOrderProductNotFound() {
        Order order = new Order();
        Product product = new Product();
        OrderedProduct orderedProduct = new OrderedProduct();
        orderedProduct.setProduct(product);
        order.setOrderedProducts(List.of(orderedProduct));
        when(productRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> orderService.saveOrder(order));
    }

    @Test
    void testUpdateOrder() {
        Order existingOrder = new Order();
        Order updatedOrder = new Order();
        PaymentType paymentType = new PaymentType();
        Product product = new Product();
        product.setId(1);
        OrderedProduct orderedProduct = new OrderedProduct();
        orderedProduct.setProduct(product);
        updatedOrder.setOrderedProducts(List.of(orderedProduct));
        when(orderRepository.findById(anyInt())).thenReturn(Optional.of(existingOrder));
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.of(paymentType));
        when(productRepository.findById(anyInt())).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenReturn(updatedOrder);

        Order result = orderService.updateOrder(1, updatedOrder);

        assertNotNull(result);
        verify(orderRepository, times(1)).save(existingOrder);
    }

    @Test
    void testDeleteOrder() {
        when(orderRepository.findById(anyInt())).thenReturn(Optional.of(new Order()));

        orderService.deleteOrder(1);

        verify(orderRepository, times(1)).findById(1);
        verify(orderRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeleteOrderNotFound() {
        when(orderRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> orderService.deleteOrder(1));
    }
}