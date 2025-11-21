import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import axios from 'axios';
import '../App.css'
import axiosInstance from './axiosIntercepter.js';

export function DelAc() {
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

    const changeTheamFn = () => {
        theam == 'dark' ? setTheam('light') : setTheam('dark');

    }
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
    const deleteAccountFn = async (e) => {
        e.preventDefault()
        try {
            const check = checkValidetion()
            if (!check) return console.log('Feild/s are empty')

            const result = await axiosInstance.delete('/deleteaccount', data, {
                headers: { 'Content-Type': 'application/json' }
            })

            if (result.response.status == 404) {
                console.log(result.response.message, result.response.status)
            }
            if (result.response.status == 200) {
                console.log('User Deleted')
                sessionStorage.clear()
                localStorage.clear()
                navigate('/login')
            }
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
                        <div className='component-heading'>Delete Account</div >
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

                        <input type="button" className="btn" onClick={(e) => {
                            deleteAccountFn(e)
                        }} value="Submit" />
                    </div>
                </div>
            </div>
        </>
    );
}