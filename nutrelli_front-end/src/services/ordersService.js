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
}