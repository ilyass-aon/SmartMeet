import axios from 'axios';

// L'adresse de ton Backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Avant chaque requête, on vérifie si on a un token en mémoire
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // On récupère le token stocké lors du Login
        if (token) {
            // On l ajoute dans le header "Authorization"
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;