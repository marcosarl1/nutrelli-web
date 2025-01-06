package com.nutrelliapi.repository;

import com.nutrelliapi.model.ProductOrdered;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductOrderedRepository extends JpaRepository<ProductOrdered, Integer> {
}
