import React from 'react';
import { useNavigate } from 'react-router-dom';

export function LogOut() {
    const navigate = useNavigate()
    const logout = () => {
        sessionStorage.clear()
        localStorage.clear()
        navigate('/login')
    }
    return (
        <button onClick={logout}>
            logout
        </button>
    );
}