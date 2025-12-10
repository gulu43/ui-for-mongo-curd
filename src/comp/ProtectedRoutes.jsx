import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { StateContext } from './App.jsx';
import { Navigate } from 'react-router-dom';
import axiosInstance from './axiosIntercepter.js'
import { AllUsers } from './AllUsers.jsx';
export function ProtectedRoutes({ children, requiredRole }) {

    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)
    const role = localStorage.getItem('role')
    if (!tokens.accessToken && !tokens.refreshToken) {
        return <Navigate to="/login" replace />
    }

    if (Array.isArray(requiredRole) && !requiredRole.includes(role)) {
        return <Navigate to="/pagenotfound" replace />;
    }


    return children
}