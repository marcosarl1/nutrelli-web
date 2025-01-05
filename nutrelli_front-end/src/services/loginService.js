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
        return res.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Erro ao fazer logout');
        }
        throw new Error('Erro desconhecido');
    }
}


export async function authenticate(token) {
    try {
        const res = await api.post('/auth',  {}, {
            headers: {
                Cookie: `jwt_token=${token}`
            }
        });
        return res.status === 200;
    } catch (error) {
        console.error('Erro ao validar token', error);
        return false;
    }
}
