package com.nutrelliapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class OrderedProductNotFoundException extends RuntimeException {
    public OrderedProductNotFoundException(String message) {
        super(message);
    }
}
