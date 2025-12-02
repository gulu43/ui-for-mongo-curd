import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import { Register } from './Register.jsx';
import axios from 'axios';
import '../App.css'
import axiosInstance from './axiosIntercepter.js';
import { Table } from 'react-bootstrap';
import MainCard from '../components/MainCard.jsx';
import '../index.scss';
import { Button } from 'react-bootstrap';

export function AllUsers() {
    const [usersData, setUsersData] = useState([])
    const [popupstate, setPopupstate] = useState(false)
    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)

    useEffect(() => {
        getUsersFn()
    }, [])

    const getUsersFn = async () => {
        const result = await axiosInstance.get('/getuser', {})
        setUsersData(result.data.data)
        console.log('all values', result.data);
    }

    return (
        <>
            <MainCard title="Users Data" >
                <span className='Add-Feth-cont' id='toggle-btn'>

                    <button variant="outline-danger" type="button" className="btn btn-primary" onClick={() => {
                        setPopupstate(prev => !prev);
                    }}>All User</button>

                    {popupstate && (
                        <div className="popup-cont">
                            <div className='heading-popup'>
                                <h5 className='' >Add User</h5>
                                {/* <input type="button" className='btn-user' id='close' */}
                                    <Button variant="outline-danger" onClick={() => {

                                        setPopupstate(prev => !prev);
                                    }}>x</Button>


                            </div>
                            <Register popupMode={true} />
                        </div>
                    )}

                </span>

                <Table responsive striped className="mb-0 table-striped">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Usersname</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>CreatedAt</th>
                            <th>UpdatedAt</th>
                            <th>Version</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usersData.map((row) => (
                            <tr key={row._id}>
                                <td>{row._id}</td>
                                <td>{row.name}</td>
                                <td>{row.age}</td>
                                <td>{row.usersname}</td>
                                <td>{row.password}</td>
                                <td>{row.status ? 'Active' : 'Inactive'}</td>
                                <td>{row.role}</td>
                                <td>{row.createdAt}</td>
                                <td>{row.updatedAt}</td>
                                <td>{row.__v}</td>
                                <td>
                                    <button className='btn btn-warning'>Edit</button>
                                </td>
                                <td>
                                    <button className='btn btn-danger'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </MainCard>


        </>
    );
}