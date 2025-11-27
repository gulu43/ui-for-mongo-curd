import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import { Register } from './Register.jsx';
import axios from 'axios';
import '../App.css'
import axiosInstance from './axiosIntercepter.js';

export function AllUsers() {
    const [usersData, setUsersData] = useState([])
    const [popupstate, setPopupstate] = useState(false)
    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)


    const changeTheamFn = () => {
        theam == 'dark' ? setTheam('light') : setTheam('dark')
    }

    const getUsersFn = async () => {
        const result = await axiosInstance.get('/getuser', {})
        // setUsersData((prev)=>({
        //     ...prev,
        //     data : result.data.data
        // }))
        setUsersData(result.data.data)
        console.log('all values', result.data);
    }

    return (
        <>
            <div className='register-outer-cont'>
                <div className='register-inner'>
                    <div className='heading-cont'>
                        <div className='component-heading'>Admin Pannel</div >
                        <img className='themIcon' src="./contrast.png" alt="O" onClick={changeTheamFn} />
                    </div>

                    <div className='form-body'>

                        <span className='Add-Feth-cont' id='toggle-btn'>
                            <input type="button" className="btnAdmin" onClick={(e) => {
                                setPopupstate(prev => !prev);
                                // setPopupstate(popupstate == true ? false : true )
                            }} value="Add User" />
                            {popupstate && (
                                <div className="popup-cont">
                                    <div className='heading-popup'>
                                        <div className='component-heading' >Add User</div>
                                        <input type="button" className='btn-user' id='close' value="Close" onClick={(e) => {
                                            setPopupstate(prev => !prev);
                                        }} />
                                    </div>
                                    <Register popupMode={true} />
                                </div>
                            )}

                            <input type="button" className="btnAdmin" onClick={(e) => {
                                // e.target.style.display = 'none'
                                getUsersFn(e)
                            }} value="Fetch All" />

                        </span>

                        <div className='table' >
                            {usersData.map((row) => (
                                <div className='eachRow' key={row._id}>
                                    <span className='column'>id: {row._id}</span>
                                    <span className='column'>Name: {row.name}</span>
                                    <span className='column'>Age: {row.age}</span>
                                    <span className='column'>Usersname: {row.usersname}</span>
                                    <span className='column'>Password: {row.password}</span>
                                    <span className='column'>Status: {row.status ? 'Active' : 'Inactive'}</span>
                                    <span className='column'>Role: {row.role}</span>
                                    <span className='column'>CreatedAt: {row.createdAt}</span>
                                    <span className='column'>UpdatedAt: {row.updatedAt}</span>
                                    <span className='column'>Version: {row.__v}</span>
                                    <input type="button" value="Edit" className='btn-user' />
                                    <input type="button" value="Delete" className='btn-user' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}