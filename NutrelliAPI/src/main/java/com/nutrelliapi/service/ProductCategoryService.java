package com.nutrelliapi.service;

import com.nutrelliapi.model.ProductCategory;

import java.util.List;

public interface ProductCategoryService {
    List<ProductCategory> findAllProductCategories();
    ProductCategory findProductCategoryById(Integer id);
    ProductCategory saveProductCategory(ProductCategory productCategory);
    ProductCategory updateProductCategory(Integer id, ProductCategory productCategory);
    void deleteProductCategory(Integer id);
}
