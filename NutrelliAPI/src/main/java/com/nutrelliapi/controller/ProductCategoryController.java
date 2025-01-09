package com.nutrelliapi.controller;

import com.nutrelliapi.model.ProductCategory;
import com.nutrelliapi.service.ProductCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-categories")
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @GetMapping
    public ResponseEntity<List<ProductCategory>> findAllProductCategories() {
        List<ProductCategory> productCategories = productCategoryService.findAllProductCategories();
        return ResponseEntity.ok(productCategories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductCategory> findProductCategoryById(@PathVariable Integer id) {
        ProductCategory productCategory = productCategoryService.findProductCategoryById(id);
        return ResponseEntity.ok(productCategory);
    }

    @PostMapping("/add")
    public ResponseEntity<ProductCategory> saveProductCategory(@RequestBody ProductCategory productCategory) {
        ProductCategory savedProductCategory = productCategoryService.saveProductCategory(productCategory);
        return ResponseEntity.ok(savedProductCategory);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductCategory> updateProductCategory(@PathVariable Integer id, @RequestBody ProductCategory productCategory) {
        ProductCategory updatedProductCategory = productCategoryService.updateProductCategory(id, productCategory);
        return ResponseEntity.ok(updatedProductCategory);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductCategory> deleteProductCategory(@PathVariable Integer id) {
        productCategoryService.deleteProductCategory(id);
        return ResponseEntity.noContent().build();
    }
}
