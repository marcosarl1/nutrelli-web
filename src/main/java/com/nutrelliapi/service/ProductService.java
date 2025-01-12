package com.nutrelliapi.service;

import com.nutrelliapi.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    List<Product> findAllProducts();
    Page<Product> findAllProductsPage(Pageable pageable);
    Page<Product> findProductsByProductCategory(Integer categoryId, Pageable pageable);
    Product findProductById(Integer id);
    Page<Product> findAllProductsContaining(String query, Pageable pageable);
    Product saveProduct(Product product);
    Product updateProduct(Integer id, Product product);
    void deleteProduct(Integer id);
}
