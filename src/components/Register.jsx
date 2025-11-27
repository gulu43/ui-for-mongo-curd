import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import axios from 'axios';
import '../App.css'

export function Register({ popupMode = false }) {

    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)
    const [errorMessage, setErrorMessage] = useState({
        name: '',
        age: '',
        usersname: '',
        password: ''
    })
    const [data, setData] = useState({
        name: '',
        age: 0,
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
        if (data.name == '') {
            InvalidFields.name = 'Name Sould not be empty'
        }
        if (data.age == -1 || data.age <= 13) {
            InvalidFields.age = 'Age Sould not be empty or less than 13'
        }
        if (data.usersname == '') {
            InvalidFields.usersname = 'Username Sould not be empty'
        }
        if (data.password == '') {
            InvalidFields.password = 'Password Sould not be empty'
        }
        setErrorMessage(InvalidFields)
        return Object.keys(InvalidFields).length === 0
    }
    const registerFn = async (e) => {
        e.preventDefault()
        try {
            const check = checkValidetion()
            if (!check) return console.log('Feild/s are empty')

            const result = await axios.post('http://localhost:4000/register', data, {
                headers: { 'Content-Type': 'application/json' }
            })

            console.log(result.data.message, result.status)

            navigate('/login')
            // }
        } catch (error) {

            if (error.status == 400) {
                console.log(error.response.data.message)
            }
            else if (error.status == 401) {
                console.log('Error: ', error.response.data?.message || 'Fields Should not be empty')
                console.log('Status:', error.response.status)
            } else {
                console.log(`Network error in register.jsx: ${error}` || 'something went rong')
            }
        }
    }

    return (
        <>
            <div className={popupMode ? "popup-register" : "login-cont-div"}>
                {!popupMode && <span className='login-left-span'></span>}
                <span className={popupMode ? "popup-right" : "login-right-span"}>

                    {!popupMode && (
                        <div className='heading-cont'>
                            <div className='component-heading'>Register</div >
                            <img className='themIcon' src="./contrast.png" alt="O" onClick={changeTheamFn} />
                        </div>
                    )}

                    <div className='form-body'>
                        <div className='cont-of-inp'>
                            <input type="text" id="name" className='inp' placeholder='name' onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    name: e.target.value
                                }))
                            }} />
                            <span className='error-message'>{errorMessage.name}</span>
                        </div>
                        <div className='cont-of-inp'>
                            <input type="number" id="age" className='inp' placeholder='Age' onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    age: e.target.value
                                }))
                            }} />
                            <span className='error-message'>{errorMessage.age}</span>
                        </div>
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
                            registerFn(e)
                        }} value="Submit" />
                    </div>
                </span>
            </div>
        </>
    );
}