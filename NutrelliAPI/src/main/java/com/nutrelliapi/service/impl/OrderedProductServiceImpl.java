package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.OrderedProductNotFoundException;
import com.nutrelliapi.model.OrderedProduct;
import com.nutrelliapi.repository.OrderedProductRepository;
import com.nutrelliapi.service.OrderedProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderedProductServiceImpl implements OrderedProductService {

    private final OrderedProductRepository orderedProductRepository;

    public OrderedProductServiceImpl(OrderedProductRepository orderedProductRepository) {
        this.orderedProductRepository = orderedProductRepository;
    }

    @Override
    public List<OrderedProduct> findAllOrderedProducts() {
        return orderedProductRepository.findAll();
    }

    @Override
    public OrderedProduct findOrderedProductById(Integer id) {
        return orderedProductRepository.findById(id)
                .orElseThrow(() -> new OrderedProductNotFoundException("Produto do pedido não encontrado"));
    }

    @Override
    public OrderedProduct saveOrderedProduct(OrderedProduct orderedProduct) {
        return orderedProductRepository.save(orderedProduct);
    }

    @Override
    public OrderedProduct updateOrderedProduct(Integer id, OrderedProduct orderedProduct) {
        return orderedProductRepository.findById(id)
                .map(existingOrderedProduct -> {
                    orderedProduct.setId(id);
                    return orderedProductRepository.save(orderedProduct);
                }).orElseThrow(() -> new OrderedProductNotFoundException("Produto do pedido não encontrado"));
    }

    @Override
    public void deleteOrderedProduct(Integer id) {
        if (orderedProductRepository.findById(id).isEmpty()) {
            throw new OrderedProductNotFoundException("Produto do pedido não encontrado");
        }
        orderedProductRepository.deleteById(id);
    }
}
