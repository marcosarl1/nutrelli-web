package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.ProductCategoryNotFoundException;
import com.nutrelliapi.model.ProductCategory;
import com.nutrelliapi.repository.ProductCategoryRepository;
import com.nutrelliapi.service.impl.ProductCategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductCategoryServiceImplTest {

    @Mock
    private ProductCategoryRepository productCategoryRepository;

    @InjectMocks
    private ProductCategoryServiceImpl productCategoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllProductCategories() {
        ProductCategory productCategory = new ProductCategory();
        when(productCategoryRepository.findAll()).thenReturn(List.of(productCategory));

        List<ProductCategory> result = productCategoryService.findAllProductCategories();

        assertEquals(1, result.size());
        verify(productCategoryRepository, times(1)).findAll();
    }

    @Test
    void testFindProductCategoryById() {
        ProductCategory productCategory = new ProductCategory();
        when(productCategoryRepository.findById(anyInt())).thenReturn(Optional.of(productCategory));

        ProductCategory result = productCategoryService.findProductCategoryById(1);

        assertNotNull(result);
        verify(productCategoryRepository, times(1)).findById(1);
    }

    @Test
    void testFindProductCategoryByIdNotFound() {
        when(productCategoryRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ProductCategoryNotFoundException.class, () -> productCategoryService.findProductCategoryById(1));
    }

    @Test
    void testSaveProductCategory() {
        ProductCategory productCategory = new ProductCategory();
        when(productCategoryRepository.save(any(ProductCategory.class))).thenReturn(productCategory);

        ProductCategory result = productCategoryService.saveProductCategory(productCategory);

        assertNotNull(result);
        verify(productCategoryRepository, times(1)).save(productCategory);
    }

    @Test
    void testUpdateProductCategory() {
        ProductCategory existingProductCategory = new ProductCategory();
        ProductCategory updatedProductCategory = new ProductCategory();
        when(productCategoryRepository.findById(anyInt())).thenReturn(Optional.of(existingProductCategory));
        when(productCategoryRepository.save(any(ProductCategory.class))).thenReturn(updatedProductCategory);

        ProductCategory result = productCategoryService.updateProductCategory(1, updatedProductCategory);

        assertNotNull(result);
        verify(productCategoryRepository, times(1)).findById(1);
        verify(productCategoryRepository, times(1)).save(updatedProductCategory);
    }

    @Test
    void testUpdateProductCategoryNotFound() {
        ProductCategory updatedProductCategory = new ProductCategory();
        when(productCategoryRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ProductCategoryNotFoundException.class, () -> productCategoryService.updateProductCategory(1, updatedProductCategory));
    }

    @Test
    void testDeleteProductCategory() {
        when(productCategoryRepository.existsById(anyInt())).thenReturn(true);

        productCategoryService.deleteProductCategory(1);

        verify(productCategoryRepository, times(1)).existsById(1);
        verify(productCategoryRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeleteProductCategoryNotFound() {
        when(productCategoryRepository.existsById(anyInt())).thenReturn(false);

        assertThrows(ProductCategoryNotFoundException.class, () -> productCategoryService.deleteProductCategory(1));
    }
}