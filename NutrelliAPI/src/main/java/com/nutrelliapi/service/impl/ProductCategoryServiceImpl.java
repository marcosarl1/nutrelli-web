package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.ProductCategoryNotFoundException;
import com.nutrelliapi.exception.ProductNotFoundException;
import com.nutrelliapi.model.ProductCategory;
import com.nutrelliapi.repository.ProductCategoryRepository;
import com.nutrelliapi.service.ProductCategoryService;

import java.util.List;

public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryServiceImpl(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    @Override
    public List<ProductCategory> findAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    @Override
    public ProductCategory findProductCategoryById(Integer id) {
        return productCategoryRepository.findById(id)
                .orElseThrow(() -> new ProductCategoryNotFoundException("Categoria de produto não encontrada"));
    }

    @Override
    public ProductCategory saveProductCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    @Override
    public ProductCategory updateProductCategory(Integer id, ProductCategory productCategory) {
        return productCategoryRepository.findById(id)
                .map(existingProductCategory -> {
                    productCategory.setId(id);
                    return productCategoryRepository.save(productCategory);
                }).orElseThrow(() -> new ProductCategoryNotFoundException("Categoria de produto não encontrada"));
    }

    @Override
    public void deleteProductCategory(Integer id) {
        if (!productCategoryRepository.existsById(id)) {
            throw new ProductNotFoundException("Categoria de produto não encontrada");
        }
        productCategoryRepository.deleteById(id);
    }
}
