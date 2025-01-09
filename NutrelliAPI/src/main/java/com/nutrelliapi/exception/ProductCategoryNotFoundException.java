package com.nutrelliapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProductCategoryNotFoundException extends RuntimeException {
    public ProductCategoryNotFoundException(String message) {
        super(message);
    }
}
