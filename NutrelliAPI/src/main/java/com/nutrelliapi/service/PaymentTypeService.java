package com.nutrelliapi.service;

import com.nutrelliapi.model.PaymentType;

import java.util.List;

public interface PaymentTypeService {
    List<PaymentType> findAllPaymentTypes();
    PaymentType findPaymentTypeById(Integer id);
    PaymentType savePaymentType(PaymentType paymentType);
    PaymentType updatePaymentType(Integer id, PaymentType paymentType);
    void deletePaymentType(Integer id);
}
