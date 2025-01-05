package com.nutrelliapi.model;

public enum OrderStatus {
    PENDENTE("Pendente"),
    EM_PREPARO("Em preparo"),
    EM_ENTREGA("Em entrega"),
    ENTREGUE("Entregue"),
    FINALIZADO("Finalizado"),
    CANCELADO("Cancelado");

    private String description;
    OrderStatus(String description) {
        this.description = description;
    }
}
