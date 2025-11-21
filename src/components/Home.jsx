import React, { useState } from 'react';
import axiosInstance from './axiosIntercepter.js'
import { useNavigate } from 'react-router-dom';
import '../App.css'

export function Home() {

    const navigate = useNavigate()
    const checkUserFn = async (e) => {
        e.preventDefault()
        sessionStorage.clear()
        localStorage.clear()
        console.log('/login')
        navigate('/login')
    }

    return (
        <>
            <h2>Home</h2> <input type="button" className="btn" onClick={(e) => {
                checkUserFn(e)
            }} value="Logout" />

        </>
    );
}