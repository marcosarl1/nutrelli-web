package com.nutrelliapi.service.impl;

import com.nutrelliapi.exception.PaymentTypeNotFoundException;
import com.nutrelliapi.model.PaymentType;
import com.nutrelliapi.repository.PaymentTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentTypeServiceImplTest {

    @Mock
    private PaymentTypeRepository paymentTypeRepository;

    @InjectMocks
    private PaymentTypeServiceImpl paymentTypeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllPaymentTypes() {
        PaymentType paymentType = new PaymentType();
        when(paymentTypeRepository.findAll()).thenReturn(List.of(paymentType));

        List<PaymentType> result = paymentTypeService.findAllPaymentTypes();

        assertEquals(1, result.size());
        verify(paymentTypeRepository, times(1)).findAll();
    }

    @Test
    void testFindPaymentTypeById() {
        PaymentType paymentType = new PaymentType();
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.of(paymentType));

        PaymentType result = paymentTypeService.findPaymentTypeById(1);

        assertNotNull(result);
        verify(paymentTypeRepository, times(1)).findById(1);
    }

    @Test
    void testFindPaymentTypeByIdNotFound() {
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(PaymentTypeNotFoundException.class, () -> paymentTypeService.findPaymentTypeById(1));
    }

    @Test
    void testSavePaymentType() {
        PaymentType paymentType = new PaymentType();
        when(paymentTypeRepository.save(any(PaymentType.class))).thenReturn(paymentType);

        PaymentType result = paymentTypeService.savePaymentType(paymentType);

        assertNotNull(result);
        verify(paymentTypeRepository, times(1)).save(paymentType);
    }

    @Test
    void testUpdatePaymentType() {
        PaymentType existingPaymentType = new PaymentType();
        PaymentType updatedPaymentType = new PaymentType();
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.of(existingPaymentType));
        when(paymentTypeRepository.save(any(PaymentType.class))).thenReturn(updatedPaymentType);

        PaymentType result = paymentTypeService.updatePaymentType(1, updatedPaymentType);

        assertNotNull(result);
        verify(paymentTypeRepository, times(1)).findById(1);
        verify(paymentTypeRepository, times(1)).save(updatedPaymentType);
    }

    @Test
    void testUpdatePaymentTypeNotFound() {
        PaymentType updatedPaymentType = new PaymentType();
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(PaymentTypeNotFoundException.class, () -> paymentTypeService.updatePaymentType(1, updatedPaymentType));
    }

    @Test
    void testDeletePaymentType() {
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.of(new PaymentType()));

        paymentTypeService.deletePaymentType(1);

        verify(paymentTypeRepository, times(1)).findById(1);
        verify(paymentTypeRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeletePaymentTypeNotFound() {
        when(paymentTypeRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(PaymentTypeNotFoundException.class, () -> paymentTypeService.deletePaymentType(1));
    }
}