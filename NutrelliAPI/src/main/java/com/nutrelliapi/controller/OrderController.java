package com.nutrelliapi.controller;

import com.nutrelliapi.dto.OrderDTO;
import com.nutrelliapi.mapper.OrderMapper;
import com.nutrelliapi.model.Order;
import com.nutrelliapi.model.OrderStatus;
import com.nutrelliapi.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public OrderController(OrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> findAllOrders() {
        List<OrderDTO> orders = orderService.findAllOrders()
                .stream()
                .map(orderMapper::toDto)
                .toList();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> findOrderById(@PathVariable Integer id) {
        Order order = orderService.findOrderById(id);
        return ResponseEntity.ok(orderMapper.toDto(order));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<OrderDTO>> findAllOrdersPage(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(required = false) String customer,
            @RequestParam(required = false) OrderStatus orderStatus) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders;

        if (customer != null && !customer.isEmpty()) {
            orders = orderService.findOrdersByCustomerContainingIgnoreCase(customer, pageable);
        } else if (orderStatus != null) {
            orders = orderService.findOrderByOrderStatus(orderStatus, pageable);
        } else {
            orders = orderService.findAllOrdersPage(pageable);
        }

        return ResponseEntity.ok(orders.map(orderMapper::toDto));
    }

    @PostMapping("/add")
    public ResponseEntity<OrderDTO> saveOrder(@Valid @RequestBody OrderDTO orderDTO) {
        Order order = orderMapper.toEntity(orderDTO);
        Order savedOrder = orderService.saveOrder(order);
        return new ResponseEntity<>(orderMapper.toDto(savedOrder), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Integer id, @Valid @RequestBody OrderDTO orderDTO) {
        Order order = orderMapper.toEntity(orderDTO);
        Order updatedOrder = orderService.updateOrder(id, order);
        return ResponseEntity.ok(orderMapper.toDto(updatedOrder));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
