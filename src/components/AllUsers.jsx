import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import axios from 'axios';
import '../App.css'
import axiosInstance from './axiosIntercepter.js';

export function AllUsers() {
    const [usersData, setUsersData] = useState({})
    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)

    
    const changeTheamFn = () => {
        theam == 'dark' ? setTheam('light') : setTheam('dark')
    }

    const getUsersFn = async () => {
        const result = await axiosInstance.get('/getuser', {})
        console.log('all values',result.data);
        
    }

    return (
        <>
            <div className='register-outer-cont'>
                <div className='register-inner'>
                    <div className='heading-cont'>
                        <div className='component-heading'>All Users</div >
                        <img className='themIcon' src="./contrast.png" alt="O" onClick={changeTheamFn} />
                    </div>

                    <div className='form-body'>
                        <input type="button" className="btn" onClick={(e) => {
                            getUsersFn(e)
                        }} value="Fetch All Ac" />
                        <span className='temp'>
                            { }
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}