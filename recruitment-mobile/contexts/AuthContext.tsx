import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { apiLogin } from '../services/api';

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    setIsAuthenticated(true);
                    // Set default auth header for initial loads
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (e) {
                console.error('Failed to check auth state');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (username: string, pass: string) => {
        try {
            const response = await apiLogin(username, pass);

            // Assume token comes back in the response. If not, use a fallback for now.
            const token = response?.token || response?.user?.token || 'mock_token_for_dev';

            await AsyncStorage.setItem('userToken', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            delete api.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
        } catch (e) {
            console.error('Failed to logout');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
