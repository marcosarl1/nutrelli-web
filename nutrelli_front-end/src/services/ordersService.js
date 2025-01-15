import api from "@/services/api";

export const ordersService = {
    async findAllOrders(page = 0, size = 10, search = '', status = '') {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                ...(search && { query: search }),
                ...(status && { orderStatus: status.name})
            });
            const res = await api.get(`/orders/page?${params}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao carregar pedidos");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async findAllOrderStatuses() {
        try {
            const res = await api.get("/orders/status")
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao carregar status de pedidos");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async findAllPaymentTypes() {
        try {
            const res = await api.get("/payment-type");
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao carregar status de pedidos");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async addOrder(formData) {
        try {
            const res = await api.post("/orders/add");
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao carregar status de pedidos");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async editOrder(id, formData) {
        try {
            const res = await api.put(`/orders/update/${id}`, formData);
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao carregar status de pedidos");
            }
            throw new Error('Erro desconhecido');
        }
    }
}