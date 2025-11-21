import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'

export function LogOut() {
    const navigate = useNavigate()

    const logout = () => {
        sessionStorage.clear()
        localStorage.clear()
        setTimeout(() => {
            console.log('After storage than /login else it will comepack to /home');

            navigate('/login')
            
        }, [1500])
    }
    return (
        <input type="button" className="btn" onClick={(e) => {
            logout(e)
        }} value="Logout" />
    );
}