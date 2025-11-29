import React, { useState } from 'react';
import axiosInstance from './axiosIntercepter.js'
import '../App.css'

export function MultipalErrorExample() {

    // const [usersname, setUsername] = useState('')
    // const [errorMessage, setErrorMessage] = useState('');

    const checkUsersFn = async (e) => {
        e.preventDefault()
        try {

            const result = Promise.all([
                axiosInstance.get('/getuser?usersname=Gulu43'),
                axiosInstance.get('/getuser?usersname=Abhi07'),
                axiosInstance.get('/getuser?usersname=Aryan15'),
            ])
            // const result = await axiosInstance.get('/getuser?usersname=Gulu43')
            // const result1 = await axiosInstance.get('/getuser?usersname=Abhi07')
            // const result2 = await axiosInstance.get('/getuser?usersname=Aryan15')

            // console.log("home.jsx response after first request: ", result[0]?.data, result[0]?.status)
            // console.log("home.jsx response after second request: ", result[1]?.data, result[1]?.status)
            // console.log("home.jsx response after third request: ", result[2]?.data, result[2]?.status)
            console.log('error from aI to home:', result);

            if (result.status == 200) {
                console.log('result data: ', result.data.data)
                // console.log('result1 data: ', result1.data.data)
                // console.log('result2 data: ', result2.data.data)

            }
        } catch (error) {
            console.log('Error in Home.jsx: ', error)
        }
    }

    return (
        <>
            <h1>HomeExamle</h1>

            <input type="button" className="btn-demo" onClick={(e) => {
                checkUsersFn(e)
            }} value="Submit" />
        </>
    );
}