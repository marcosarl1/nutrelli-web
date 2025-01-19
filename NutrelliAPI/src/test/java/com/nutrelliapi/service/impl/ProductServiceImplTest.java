package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.ProductNotFoundException;
import com.nutrelliapi.model.Product;
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

class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllProducts() {
        Product product = new Product();
        when(productRepository.findAll()).thenReturn(List.of(product));

        List<Product> result = productService.findAllProducts();

        assertEquals(1, result.size());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void testFindProductById() {
        Product product = new Product();
        when(productRepository.findById(anyInt())).thenReturn(Optional.of(product));

        Product result = productService.findProductById(1);

        assertNotNull(result);
        verify(productRepository, times(1)).findById(1);
    }

    @Test
    void testFindProductByIdNotFound() {
        when(productRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.findProductById(1));
    }

    @Test
    void testFindAllProductsPage() {
        Product product = new Product();
        Page<Product> page = new PageImpl<>(List.of(product));
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findAll(pageable)).thenReturn(page);

        Page<Product> result = productService.findAllProductsPage(pageable);

        assertEquals(1, result.getTotalElements());
        verify(productRepository, times(1)).findAll(pageable);
    }

    @Test
    void testFindAllProductsContaining() {
        Product product = new Product();
        Page<Product> page = new PageImpl<>(List.of(product));
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findProductsByNameContainingIgnoreCase(anyString(), eq(pageable))).thenReturn(page);

        Page<Product> result = productService.findAllProductsContaining("query", pageable);

        assertEquals(1, result.getTotalElements());
        verify(productRepository, times(1)).findProductsByNameContainingIgnoreCase("query", pageable);
    }

    @Test
    void testFindProductsByProductCategory() {
        Product product = new Product();
        Page<Product> page = new PageImpl<>(List.of(product));
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findProductsByProductCategory_Id(anyInt(), eq(pageable))).thenReturn(page);

        Page<Product> result = productService.findProductsByProductCategory(1, pageable);

        assertEquals(1, result.getTotalElements());
        verify(productRepository, times(1)).findProductsByProductCategory_Id(1, pageable);
    }

    @Test
    void testFindProductsByAvailable() {
        Product product = new Product();
        Page<Product> page = new PageImpl<>(List.of(product));
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findProductsByAvailable(anyBoolean(), eq(pageable))).thenReturn(page);

        Page<Product> result = productService.findProductsByAvailable(true, pageable);

        assertEquals(1, result.getTotalElements());
        verify(productRepository, times(1)).findProductsByAvailable(true, pageable);
    }

    @Test
    void testSaveProduct() {
        Product product = new Product();
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = productService.saveProduct(product);

        assertNotNull(result);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testUpdateProduct() {
        Product existingProduct = new Product();
        Product updatedProduct = new Product();
        when(productRepository.findById(anyInt())).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        Product result = productService.updateProduct(1, updatedProduct);

        assertNotNull(result);
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, times(1)).save(updatedProduct);
    }

    @Test
    void testUpdateProductNotFound() {
        Product updatedProduct = new Product();
        when(productRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.updateProduct(1, updatedProduct));
    }

    @Test
    void testDeleteProduct() {
        when(productRepository.existsById(anyInt())).thenReturn(true);

        productService.deleteProduct(1);

        verify(productRepository, times(1)).existsById(1);
        verify(productRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeleteProductNotFound() {
        when(productRepository.existsById(anyInt())).thenReturn(false);

        assertThrows(ProductNotFoundException.class, () -> productService.deleteProduct(1));
    }
}