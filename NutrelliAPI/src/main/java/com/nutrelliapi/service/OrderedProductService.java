package com.nutrelliapi.service;

import com.nutrelliapi.model.OrderedProduct;

import java.util.List;

public interface OrderedProductService {
    List<OrderedProduct> findAllOrderedProducts();
    OrderedProduct findOrderedProductById(Integer id);
    OrderedProduct saveOrderedProduct(OrderedProduct orderedProduct);
    OrderedProduct updateOrderedProduct(Integer id,OrderedProduct orderedProduct);
    void deleteOrderedProduct(Integer id);
}
