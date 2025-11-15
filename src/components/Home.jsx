import React, { useState } from 'react';
import api from './axiosIntercepter.js'
import '../App.css'

export function Home() {

    const [usersname, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState('');

    const checkUserFn = async (e) => {
        e.preventDefault()
        try {
            // const check = checkValidetion()
            // if (!usersname) {
            //     setErrorMessage("Field/s should not be empty");
            //     return;
            // }

            // const result = await api.post("/getuser", usersname);
            const result = await api.get('/getuser?usersname=Gulu43')

            console.log(result.data, result.status)

            if (result.status == 200) {
                console.log(result.data.data)

            }
        } catch (error) {
            console.log('Error:', error)
        }
    }

    return (
        <>
            <h1>Home</h1>

            <div className='cont-of-inp-demo'>
                <input type="text" className='inp' placeholder='Usersname' onChange={(e) => {
                    setUsername(e.target.value)
                }} />
                <span className='error-message'>{errorMessage}</span>
            </div>
            <input type="button" className="btn-demo" onClick={(e) => {
                checkUserFn(e)
            }} value="Submit" />
        </>
    );
}