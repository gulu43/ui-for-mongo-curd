import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { StateContext } from './App.jsx';
import { Navigate } from 'react-router-dom';
import axiosInstance from './axiosIntercepter.js'
export function ProtectedRoutes({ children }) {

    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)
    if (!tokens.accessToken && !tokens.refreshToken) {
        return <Navigate to="/login" replace />
    }
    
    return children
}