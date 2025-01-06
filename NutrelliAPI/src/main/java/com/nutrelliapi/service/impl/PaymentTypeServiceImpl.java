package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.PaymentTypeNotFoundException;
import com.nutrelliapi.model.PaymentType;
import com.nutrelliapi.repository.PaymentTypeRepository;
import com.nutrelliapi.service.PaymentTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentTypeServiceImpl implements PaymentTypeService {

    private final PaymentTypeRepository paymentTypeRepository;

    public PaymentTypeServiceImpl(PaymentTypeRepository paymentTypeRepository) {
        this.paymentTypeRepository = paymentTypeRepository;
    }

    @Override
    public List<PaymentType> findAllPaymentTypes() {
        return paymentTypeRepository.findAll();
    }

    @Override
    public PaymentType findPaymentTypeById(Integer id) {
        return paymentTypeRepository.findById(id)
                .orElseThrow(() -> new PaymentTypeNotFoundException("Tipo de pagamento não encontrado"));
    }

    @Override
    public PaymentType savePaymentType(PaymentType paymentType) {
        return paymentTypeRepository.save(paymentType);
    }

    @Override
    public PaymentType updatePaymentType(Integer id, PaymentType paymentType) {
        return paymentTypeRepository.findById(id)
                .map(payTipe -> {
                    payTipe.setId(paymentType.getId());
                    return paymentTypeRepository.save(payTipe);
                })
                .orElseThrow(() -> new PaymentTypeNotFoundException("Tipo de pagamento não encontrado"));
    }

    @Override
    public void deletePaymentType(Integer id) {
        if (paymentTypeRepository.findById(id).isEmpty()) {
            throw new PaymentTypeNotFoundException("Tipo de pagamento não encontrado");
        }
        paymentTypeRepository.deleteById(id);
    }
}
