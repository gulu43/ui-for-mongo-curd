import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import axios from 'axios';
import axiosInstance from './axiosIntercepter.js';
import '../App.css';

export function UpdatePassword() {

    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)

    const [errorMessage, setErrorMessage] = useState({
        usersname: '',
        password: '',
        newPassword: ''
    })

    const [data, setData] = useState({
        usersname: '',
        password: '',
        newPassword: ''
    })

    useEffect(() => {
        console.log("data in login: ", data)
    }, [data])

    const changeTheamFn = () => {
        theam == 'dark' ? setTheam('light') : setTheam('dark');
    }

    function checkValidetion() {
        let InvalidFields = {}
        if (data.usersname == '') {
            InvalidFields.usersname = 'Username Sould not be empty'
        }
        if (data.password == '') {
            InvalidFields.password = 'Password Sould not be empty'
        }
        if (data.newPassword == '') {
            InvalidFields.newPassword = 'New password Sould not be empty'
        }
        setErrorMessage(InvalidFields)
        return Object.keys(InvalidFields).length === 0
    }

    const updatePasswordFn = async (e) => {
        e.preventDefault()
        try {
            const check = checkValidetion()
            if (!check) return console.log('Feild/s are empty')

            const result = await axiosInstance.patch('/updatepassword', data, {
                headers: { 'Content-Type': 'application/json' }
            })

            console.log(result.data.message, result.status)

            navigate('/home')
            // }
        } catch (error) {

            if (error.response?.status == 400) {
                console.log(error.response.data.message)
            }
            else if (error.response?.status == 401) {
                console.log('Error: ', error.response.data?.message || 'Fields Should not be empty')
                console.log('Status:', error.response.status)
            } else {
                console.log(`Network error in updatePassword.jsx: ${error}` || 'something went rong')
            }
        }
    }

    return (
        <>
            <div className='register-outer-cont'>
                <div className='register-inner'>
                    <div className='heading-cont'>
                        <div className='component-heading'>Update Password</div >
                        <img className='themIcon' src="./contrast.png" alt="O" onClick={changeTheamFn} />
                    </div>

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

                        <div className='cont-of-inp'>
                            <input type="password" id="newPassword" className='inp' placeholder='New password' onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    newPassword: e.target.value
                                }))
                            }} />
                            <span className='error-message'>{errorMessage.newPassword}</span>
                        </div>

                        <input type="button" className="btn" onClick={(e) => {
                            updatePasswordFn(e)
                        }} value="Submit" />
                    </div>
                </div>
            </div>
        </>
    );
}