package com.nutrelliapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PaymentTypeNotFoundException extends RuntimeException {
    public PaymentTypeNotFoundException(String message) {
        super(message);
    }
}
