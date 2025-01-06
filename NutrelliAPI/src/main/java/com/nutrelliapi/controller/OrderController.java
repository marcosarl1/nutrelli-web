package com.nutrelliapi.controller;

import com.nutrelliapi.model.Order;
import com.nutrelliapi.model.OrderStatus;
import com.nutrelliapi.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> findAllOrders() {
        return orderService.findAllOrders();
    }

    @GetMapping("/{id}")
    public Order findOrderById(@PathVariable Integer id) {
        return orderService.findOrderById(id);
    }

    @PostMapping("/add")
    public Order saveOrder(@RequestBody Order order) {
        return orderService.saveOrder(order);
    }

    @PutMapping("/update/{id}")
    public Order updateOrder(@PathVariable Integer id, @RequestBody Order order) {
        return orderService.updateOrder(id, order);
    }

    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable Integer id, @RequestParam OrderStatus orderStatus) {
        return orderService.updateOrderStatus(id, orderStatus);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
    }
}
