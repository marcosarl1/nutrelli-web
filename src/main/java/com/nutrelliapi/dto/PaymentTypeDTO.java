package com.nutrelliapi.dto;

import com.nutrelliapi.model.PaymentType;

public class PaymentTypeDTO {
    private Integer id;
    private String name;

    public PaymentTypeDTO() {}

    public PaymentTypeDTO(PaymentType paymentType) {
        this.id = paymentType.getId();
        this.name = paymentType.getName();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
