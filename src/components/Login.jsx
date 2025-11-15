import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import axios from 'axios';
import '../App.css'

export function Login() {

    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)
    const [errorMessage, setErrorMessage] = useState({
        usersname: '',
        password: ''
    })
    const [data, setData] = useState({
        usersname: '',
        password: ''
    })
    useEffect(() => {
        console.log("data in login: ", data)
    }, [data])

    // useEffect(async () => {
    //     if (!tokens.accessToken && tokens.refreshToken.length >= 3) {
    //         const result = await axios.post('http://localhost:4000/refresh', {}, {
    //             headers: { 'refreshToken': tokens.refreshToken }
    //         })
    //         if (result.data.status == 201) {
    //             sessionStorage.setItem('accessToken', result.data.accessToken)
    //             navigate('/home')
    //         }
    //     }
    // }, []);

    // const accessToken = sessionStorage.getItem('accessToken');
    // const refreshToken = localStorage.getItem('refreshToken');
    // if (accessToken || refreshToken) {
    //     setTokens({ accessToken, refreshToken });
    // }

    function checkValidetion() {
        let InvalidFields = {}
        if (data.usersname == '') {
            InvalidFields.usersname = 'Username Sould not be empty'
        }
        if (data.password == '') {
            InvalidFields.password = 'password Sould not be empty'
        }
        setErrorMessage(InvalidFields)
        return Object.keys(InvalidFields).length === 0
    }


    const loginFn = async (e) => {
        e.preventDefault()
        try {
            const check = checkValidetion()
            if (!check) return console.log('Feilds are empty')

            const result = await axios.post('http://localhost:4000/login', data, {
                headers: { 'Content-Type': 'application/json' }
            })

            console.log(result.data.message, result.status)
            if (result.status == 200) {
                console.log(result.data.message)
                sessionStorage.setItem('accessToken', result.data.accessToken)
                localStorage.setItem('refreshToken', result.data.refreshToken)

                setTokens((prev) => ({
                    ...prev,
                    'accessToken': result.data.accessToken,
                    'refreshToken': result.data.refreshToken
                }))

                navigate('/home')
            }
        } catch (error) {

            if (error.status == 422) {
                console.log(error.response.data.message)
            }
            else if (error.status == 401) {
                console.log('Error: ', error.response.data?.message || 'Fields Should not be empty')
                console.log('Status:', error.response.status)
            } else {
                console.log('Network error:', error?.message || 'something went rong')
            }
        }
    }

    return (
        <>
            <div className='login-cont-div'>
                <span className='login-left-span'></span>
                <span className='login-right-span'>
                    <span className='component-heading'>Login</span>
                    <div className='form-body'>
                        <div className='cont-of-inp'>
                            <input type="text" id="usersname" className='inp' placeholder='Usersname' onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    usersname: e.target.value
                                }))
                            }} />
                            <span className='error-message'>{errorMessage.usersname}</span>
                        </div>
                        <div className='cont-of-inp'>
                            <input type="password" id="password" className='inp' placeholder='Password' onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    password: e.target.value
                                }))
                            }} />
                            <span className='error-message'>{errorMessage.password}</span>
                        </div>
                        <input type="button" className="btn" onClick={(e) => {
                            loginFn(e)
                        }} value="Submit" />
                    </div>
                </span>
            </div>
        </>
    );
}