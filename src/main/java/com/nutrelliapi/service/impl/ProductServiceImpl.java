package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.ProductNotFoundException;
import com.nutrelliapi.model.Product;
import com.nutrelliapi.repository.ProductRepository;
import com.nutrelliapi.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Override
    public Page<Product> findAllProductsPage(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> findAllProductsContaining(String query, Pageable pageable) {
        return productRepository.findProductsByNameContainingIgnoreCase(query, pageable);
    }

    @Override
    public Page<Product> findProductsByProductCategory(Integer categoryId, Pageable pageable) {
        return productRepository.findProductsByProductCategory_Id(categoryId, pageable);
    }

    @Override
    public Page<Product> findProductsByAvailable(boolean available, Pageable pageable) {
        return productRepository.findProductsByAvailable(available, pageable);
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
