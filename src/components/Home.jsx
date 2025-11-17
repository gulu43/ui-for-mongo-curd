import React, { useState } from 'react';
import api from './axiosIntercepter.js'
import '../App.css'

export function Home() {

    // const [usersname, setUsername] = useState('')
    // const [errorMessage, setErrorMessage] = useState('');

    const checkUserFn = async (e) => {
        e.preventDefault()
        try {

            const result = await api.get('/getuser?usersname=Gulu43')

            console.log("home.jsx response after first request: ", result?.data, result?.status)
            console.log('error from aI to home:', result);

            if (result.status == 200) {
                console.log(result.data.data)

            }
        } catch (error) {
            console.log('Error in Home.jsx: ', error)
        }
    }

    return (
        <>
            <h1>Home</h1>

            <input type="button" className="btn-demo" onClick={(e) => {
                checkUserFn(e)
            }} value="Submit" />
        </>
    );
}