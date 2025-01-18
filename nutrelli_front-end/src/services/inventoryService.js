import api from "@/services/api";

export const inventoryService = {

    async findAllItems(page = 0, size = 10, search = "", lowStock = false) {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                ...(search && {name: search}),
                lowStock: lowStock.toString(),
            });

            const res = await api.get(`/inventory/page?${params}`);
            return res.data
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro carregar itens");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async findAllMeasurementUnits() {
        try {
            const res = await api.get("/measurement-unit");
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro carregar unidade de medidas");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async addItem(formData) {
        try {
            const res = await api.post('/inventory/add', formData);
            return res.data
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao adicionar item");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async updateItem(id, formData) {
        try {
            const res = await api.patch(`/inventory/update/${id}`, formData);
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao atualizar item");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async updateQuantity(id, quantity) {
        try {
            const res = await api.patch(`/inventory/${id}/quantity`, null, {
                params: {quantity},
            });
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao atualizar quantidade");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async deleteItem(id) {
        try {
            const res = await api.delete(`/inventory/delete/${id}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro ao deletar item");
            }
            throw new Error('Erro desconhecido');
        }
    }
}