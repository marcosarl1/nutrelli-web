package com.nutrelliapi.model;

public enum OrderStatus {
    PENDENTE("Pendente"),
    EM_PREPARO("Em preparo"),
    PRONTO_PARA_RETIRADA("Pronto para retirada"),
    FINALIZADO("Finalizado"),
    CANCELADO("Cancelado");

    private final String value;
    OrderStatus(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
