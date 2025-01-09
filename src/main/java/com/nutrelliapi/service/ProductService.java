package com.nutrelliapi.service;

import com.nutrelliapi.model.Product;

import java.util.List;

public interface ProductService {
    List<Product> findAllProducts();
    Product findProductById(Integer id);
    List<Product> findProductLike(String query);
    Product saveProduct(Product product);
    Product updateProduct(Integer id, Product product);
    void deleteProduct(Integer id);
}
