import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);

// Provider
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => localStorage.getItem('username'));

    // Fonction de Connexion
    const login = (newToken, newUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', newUser);
        setToken(newToken);
        setUser(newUser);
    };

    // Fonction de Déconnexion
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    // Valeurs exposées à toute l'app
    const value = {
        token,
        user,
        isAuthenticated: !!token, // Renvoie true si le token existe
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Un petit Hook personnalisé pour utiliser le contexte plus facilement
export const useAuth = () => useContext(AuthContext);