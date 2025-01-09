package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.ProductNotFoundException;
import com.nutrelliapi.model.Product;
import com.nutrelliapi.repository.ProductRepository;
import com.nutrelliapi.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product findProductById(Integer id) {
        return productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Produto não encontrado"));
    }

    public List<Product> findProductLike(String query) {
        return productRepository.findProductsByNameContaining(query);
    }

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Integer id, Product product) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    product.setId(id);
                    return productRepository.save(product);
                }).orElseThrow(() -> new ProductNotFoundException("Produto não encontrado"));
    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Produto não encontrado");
        }
        productRepository.deleteById(id);
    }
}
