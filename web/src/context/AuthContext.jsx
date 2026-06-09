import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'patient' or 'doctor'
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('bt_user');
            const savedRole = localStorage.getItem('bt_role');
            if (savedUser && savedRole) {
                setUser(JSON.parse(savedUser));
                setRole(savedRole);
            }
        } catch (err) {
            console.error("Local storage corruption:", err);
            localStorage.removeItem('bt_user');
            localStorage.removeItem('bt_role');
        }
        setLoading(false);
    }, []);

    const login = (userData, userRole) => {
        setUser(userData);
        setRole(userRole);
        localStorage.setItem('bt_user', JSON.stringify(userData));
        localStorage.setItem('bt_role', userRole);
        if (userRole === 'patient') {
            navigate('/patient');
        } else {
            navigate('/doctor');
        }
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('bt_user');
        localStorage.removeItem('bt_role');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
