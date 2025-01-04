import api from "@/services/api";

export async function login(email, password) {
    try {
        const res = await api.post('/login', {email, password});
        localStorage.setItem('token', res.data.token);
        return res.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Erro ao fazer login');
        }
        throw new Error('Erro desconhecido');
    }
}