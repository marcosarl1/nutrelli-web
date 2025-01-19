package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.OrderedProductNotFoundException;
import com.nutrelliapi.model.OrderedProduct;
import com.nutrelliapi.repository.OrderedProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderedProductServiceImplTest {

    @Mock
    private OrderedProductRepository orderedProductRepository;

    @InjectMocks
    private OrderedProductServiceImpl orderedProductService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllOrderedProducts() {
        OrderedProduct orderedProduct = new OrderedProduct();
        when(orderedProductRepository.findAll()).thenReturn(List.of(orderedProduct));

        List<OrderedProduct> result = orderedProductService.findAllOrderedProducts();

        assertEquals(1, result.size());
        verify(orderedProductRepository, times(1)).findAll();
    }

    @Test
    void testFindOrderedProductById() {
        OrderedProduct orderedProduct = new OrderedProduct();
        when(orderedProductRepository.findById(anyInt())).thenReturn(Optional.of(orderedProduct));

        OrderedProduct result = orderedProductService.findOrderedProductById(1);

        assertNotNull(result);
        verify(orderedProductRepository, times(1)).findById(1);
    }

    @Test
    void testFindOrderedProductByIdNotFound() {
        when(orderedProductRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(OrderedProductNotFoundException.class, () -> orderedProductService.findOrderedProductById(1));
    }

    @Test
    void testSaveOrderedProduct() {
        OrderedProduct orderedProduct = new OrderedProduct();
        when(orderedProductRepository.save(any(OrderedProduct.class))).thenReturn(orderedProduct);

        OrderedProduct result = orderedProductService.saveOrderedProduct(orderedProduct);

        assertNotNull(result);
        verify(orderedProductRepository, times(1)).save(orderedProduct);
    }

    @Test
    void testUpdateOrderedProduct() {
        OrderedProduct existingOrderedProduct = new OrderedProduct();
        OrderedProduct updatedOrderedProduct = new OrderedProduct();
        when(orderedProductRepository.findById(anyInt())).thenReturn(Optional.of(existingOrderedProduct));
        when(orderedProductRepository.save(any(OrderedProduct.class))).thenReturn(updatedOrderedProduct);

        OrderedProduct result = orderedProductService.updateOrderedProduct(1, updatedOrderedProduct);

        assertNotNull(result);
        verify(orderedProductRepository, times(1)).findById(1);
        verify(orderedProductRepository, times(1)).save(updatedOrderedProduct);
    }

    @Test
    void testDeleteOrderedProduct() {
        when(orderedProductRepository.findById(anyInt())).thenReturn(Optional.of(new OrderedProduct()));

        orderedProductService.deleteOrderedProduct(1);

        verify(orderedProductRepository, times(1)).findById(1);
        verify(orderedProductRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeleteOrderedProductNotFound() {
        when(orderedProductRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(OrderedProductNotFoundException.class, () -> orderedProductService.deleteOrderedProduct(1));
    }
}