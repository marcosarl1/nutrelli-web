import api from "@/services/api";

export async function login(email, password) {
    try {
        const res = await api.post('/login', {email, password});
        return res.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Erro ao fazer login');
        }
        throw new Error('Erro desconhecido');
    }
}

export async function logout() {
    try {
        const res = await api.post('/logout');
        console.log(res.authenticated);
        return {
            authenticated: res.data.authenticated,
            userEmail: res.data.email // Include additional data if needed
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Erro ao fazer logout');
        }
        throw new Error('Erro desconhecido');
    }
}