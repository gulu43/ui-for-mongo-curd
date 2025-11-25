import React, { useState } from 'react';
import axiosInstance from './axiosIntercepter.js'
import { useNavigate } from 'react-router-dom';
import { goToLogin } from './redirect.js';
import { LogOut } from './LogOut.jsx';
import '../App.css'

export function Home() {

    const navigate = useNavigate()
    
    const checkUsersFn = async (e) => {
        e.preventDefault()
        try {

            const result = await Promise.all([
                // axiosInstance.get('/getuser?usersname=Gulu43'),
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
            <h2>Home</h2>
            
            <LogOut />
            <input type="button" className="btn" onClick={(e) => {
                checkUsersFn(e)
            }} value="Submit" />

        </>
    );
}