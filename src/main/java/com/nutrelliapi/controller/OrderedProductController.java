package com.nutrelliapi.controller;


import com.nutrelliapi.model.OrderedProduct;
import com.nutrelliapi.service.OrderedProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ordered-products")
public class OrderedProductController {

    private final OrderedProductService orderedProductService;

    public OrderedProductController(OrderedProductService orderedProductService) {
        this.orderedProductService = orderedProductService;
    }

    @GetMapping
    public List<OrderedProduct> findAllOrderedProducts() {
        return orderedProductService.findAllOrderedProducts();
    }

    @GetMapping("/{id}")
    public OrderedProduct findOrderedProductById(Integer id) {
        return orderedProductService.findOrderedProductById(id);
    }

    @PostMapping("/add")
    public OrderedProduct saveOrderedProduct(@RequestBody OrderedProduct orderedProduct) {
        return orderedProductService.saveOrderedProduct(orderedProduct);
    }

    @PutMapping("/update/{id}")
    public OrderedProduct updateOrderedProduct(@PathVariable Integer id, @RequestBody OrderedProduct orderedProduct) {
        return orderedProductService.updateOrderedProduct(id, orderedProduct);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteOrderedProduct(@PathVariable Integer id) {
        orderedProductService.deleteOrderedProduct(id);
    }
}
