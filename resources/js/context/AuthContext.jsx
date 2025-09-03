// resources/js/context/AuthContext.jsx

import { createContext, useContext, useState } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(localStorage.getItem('auth_token'));

    const login = async (credentials) => {
        const response = await apiClient.post('/login', credentials);
        const { access_token, user } = response.data;
        
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(access_token);
        setUser(user);
    };

    const logout = () => {
        apiClient.post('/logout').finally(() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);