package com.nutrelliapi.repository;

import com.nutrelliapi.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>  {
    Page<Product> findProductsByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findProductsByProductCategory_Id(Integer productCategoryId, Pageable pageable);
    Page<Product> findProductsByAvailable(boolean available, Pageable pageable);
}
