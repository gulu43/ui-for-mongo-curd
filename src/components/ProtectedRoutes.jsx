import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { StateContext } from './App.jsx';
import { Navigate } from 'react-router-dom';

export function ProtectedRoutes({ children  }) {

    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)
    console.log(tokens.accessToken, tokens.refreshToken, theam);

    if (!tokens.accessToken) {
        return <Navigate to="/login" replace />
    }

    return children 
}