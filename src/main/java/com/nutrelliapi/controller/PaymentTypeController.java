package com.nutrelliapi.controller;

import com.nutrelliapi.model.PaymentType;
import com.nutrelliapi.service.PaymentTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment-type")
public class PaymentTypeController {

    private final PaymentTypeService paymentTypeService;

    public PaymentTypeController(PaymentTypeService paymentTypeService) {
        this.paymentTypeService = paymentTypeService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentType>> findAllPaymentTypes() {
        List<PaymentType> paymentTypes = paymentTypeService.findAllPaymentTypes();
        return ResponseEntity.ok(paymentTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentType> findPaymentTypeById(@PathVariable Integer id) {
        PaymentType paymentType = paymentTypeService.findPaymentTypeById(id);
        return ResponseEntity.ok(paymentType);
    }

    @PostMapping("/add")
    public ResponseEntity<PaymentType> savePaymentType(@RequestBody PaymentType paymentType) {
        PaymentType savedPaymentType = paymentTypeService.savePaymentType(paymentType);
        return ResponseEntity.ok(savedPaymentType);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PaymentType> updatePaymentType(@PathVariable Integer id, @RequestBody PaymentType paymentType) {
        PaymentType updatedPaymentType = paymentTypeService.updatePaymentType(id, paymentType);
        return ResponseEntity.ok(updatedPaymentType);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<PaymentType> deletePaymentType(@PathVariable Integer id) {
        paymentTypeService.deletePaymentType(id);
        return ResponseEntity.noContent().build();
    }
}
