import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, name: string) => void;
    logout: () => void;
    register: (email: string, name: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email: string, name: string) => {
        // In a real app, we would validate against a backend here
        // For now, we simulate a successful login if the user exists in "database"
        // But for this simple version, we just create the session
        const newUser = { email, name };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const register = (email: string, name: string, password: string) => {
        // In a real app, we would send this to a backend
        // For now, we just log them in immediately
        console.log('Registering user:', { email, name, password });
        login(email, name);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
