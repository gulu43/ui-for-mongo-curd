import React, { useEffect } from 'react';
import { useContext } from 'react';
import { StateContext } from './App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Refresh() {
    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)
    const accessToken = sessionStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    console.log('Inside refresh: ', accessToken, refreshToken);

    useEffect(
        () => {
            async function refreshFn() {
                if (!accessToken && refreshToken) {
                    const result = await axios.post('http://localhost:4000/refresh', {}, {
                        headers: { 'refreshtoken': refreshToken }
                    })
                    console.log("Frounted /Refresh response log: ", result);

                    if (result.status == 201) {
                        sessionStorage.setItem('accessToken', result.data.accessToken)
                        // also update tokens
                        setTokens((prev) => ({
                            ...prev,
                            'accessToken': result.data.accessToken
                        }))
                        navigate('/home')
                    } else {
                        navigate('/login')
                    }
                }
            }
            refreshFn()
        }, []);
    useEffect(() => {
        console.log('useEffect Refresh in refresh before: ', tokens.accessToken, tokens.accessToken);
        const accessToken = sessionStorage.getItem('accessToken')
        console.log('useEffect Refresh: ', accessToken);
    }, [tokens])
    return (
        <>
            <span>refreshing...</span>
        </>
    );
}