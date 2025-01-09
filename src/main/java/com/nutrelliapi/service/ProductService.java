package com.nutrelliapi.service;

import com.nutrelliapi.model.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    List<Product> findAllProducts();
    Page<Product> findAllProductsPage(int page, int size);
    Product findProductById(Integer id);
    List<Product> findAllProductsContaining(String query);
    Product saveProduct(Product product);
    Product updateProduct(Integer id, Product product);
    void deleteProduct(Integer id);
}
