import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'
import axios from 'axios';
import axiosInstance from './axiosIntercepter';

export function LogOut() {
    const navigate = useNavigate()

    const logout = async () => {
        // e.preventDefault()
        // goToLogin()

        const token = localStorage.getItem('refreshToken')
        const revoking = await axiosInstance.post('http://localhost:4000/logout', { token: token })
        // console.log('rev', revoking);

        if (revoking.data.isRevoked == true) {
            sessionStorage.clear()
            localStorage.clear()
            console.log('/login')
            window.location.href = "/login";
            return;

        }
    }
    return (
        <input type="button" className="btn" onClick={(e) => {
            logout(e)
        }} value="Logout btn from LogoutComponent" />
    );
}