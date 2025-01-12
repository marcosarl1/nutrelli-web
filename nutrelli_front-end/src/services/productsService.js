import api from "@/services/api";

export const productsService = {

    async findAllProducts(page = 0, size = 10, search = '', categoryId = null) {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                ...(search && { query: search }),
                ...(categoryId && { categoryId: categoryId.toString() })
            });

            const res = await api.get(`/products/page?${params}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro carregar produtos");
            }
            throw new Error('Erro desconhecido');
        }
    },

    async findAllProductCategories() {
        try {
            const res = await api.get("/product-categories");
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.message || "Erro carregar categoria de produtos");
            }
            throw new Error('Erro desconhecido');
        }
    }
}

export default productsService;