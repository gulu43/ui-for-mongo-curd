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
import api from './axiosIntercepter.js';
import { EditUserDetails } from './EditUserDetails.jsx';
import { toast } from "react-toastify";
// import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Pagination from 'react-bootstrap/Pagination';
import PageItem from 'react-bootstrap/PageItem'

export function AllUsers_() {
    const [usersData, setUsersData] = useState([])
    const [popupstate, setPopupstate] = useState(false)
    const [popupstate2, setPopupstate2] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [page, setPage] = useState(1)

    // Info
    // skip = startingIndex
    // limit = how many documents you want

    const [pagination, setPagination] = useState({
        skip: 0,
        limit: 0
    })

    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)

    useEffect(() => {
        getUsersFn();
    }, [pagination]);

    useEffect(() => {
        getUsersFn()
    }, [])

    const getUsersFn = async () => {
        const result = await axiosInstance.get(`/getuser?skip=${pagination.skip}&limit=${pagination.limit}`, {})
        setUsersData(result.data.data)
        console.log('all values', result.data);
    }

    const deleteUserFn = async (id) => {
        const response = await api.delete('/deleteaccount', {
            data: { userId: id }
        })
        console.log(response);
        if (response.status == 200) {
            toast.success(response.data.message)
            getUsersFn()
        } else {
            toast.error(response?.data?.message || "Something went wrong")
        }

    }
    return (
        <>
            <MainCard >

                <span className='Add-Feth-cont' id='toggle-btn'>
                    <div className='flex-between'>
                        <span><b>Users Data</b> </span>
                        <div id='pagination'>
                            <ButtonToolbar aria-label="Toolbar with button groups">
                                <ButtonGroup className="me-2" aria-label="First group">
                                    <Button onClick={() => {
                                        setPagination((prev) => ({
                                            ...prev,
                                            skip: 0,
                                            limit: 3
                                        }))
                                        // getUsersFn()
                                    }}>1-3</Button>
                                    <Button onClick={() => {
                                        setPagination((prev) => ({
                                            ...prev,
                                            skip: 3,
                                            limit: 3
                                        }))
                                        // getUsersFn()
                                    }}>3-6</Button>
                                    <Button onClick={() => {
                                        setPagination((prev) => ({
                                            ...prev,
                                            skip: 0,
                                            limit: 0
                                        }))
                                        // getUsersFn()
                                    }}>All</Button>
                                </ButtonGroup>
                            </ButtonToolbar>

                            <Pagination className='sm'>
                                {/* <Pagination.First /> */}
                                <Pagination.Prev />
                                <Pagination.Item>{1}</Pagination.Item>
                                <Pagination.Ellipsis />
                                
                                <Pagination.Item>{3}</Pagination.Item>
                                <Pagination.Item active>{4}</Pagination.Item>
                                <Pagination.Item>{5}</Pagination.Item>

                                <Pagination.Ellipsis />
                                <Pagination.Item>{10}</Pagination.Item>
                                <Pagination.Next />
                                {/* <Pagination.Last /> */}
                            </Pagination>
                        </div>
                        <button variant="outline-danger" type="button" className="btn btn-primary btn-sm" onClick={() => {
                            setPopupstate(prev => !prev);
                        }}>Add User</button>
                    </div>


                    {popupstate && (
                        <div className="popup-cont">
                            <div className='heading-popup'>
                                <h5 className='' >Add User</h5>
                                {/* <input type="button" className='btn-user' id='close' */}
                                <Button variant="outline-danger" onClick={() => {

                                    setPopupstate(prev => !prev);
                                }}>x</Button>


                            </div>
                            {/* <Register popupMode={true} /> */}
                            <EditUserDetails _id={{}} reloade={getUsersFn} par={'add'} />

                        </div>
                    )}

                </span>

                <Table responsive striped hover className="mb-0 table-striped" style={{ overflowX: 'scroll' }}>

                    {/* <tbody style={{overflowX: 'scroll', marginLeft: '22%'}}> */}
                    <tbody style={{ width: '100%' }} >
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Usersname</th>
                            <th>Password</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>CreatedAt</th>
                            <th>UpdatedAt</th>
                            <th>Version</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
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
                                    <button className='btn btn-warning btn-sm' onClick={() => {
                                        // setSelectedUserId(row._id)
                                        (!selectedUserId) ? setSelectedUserId(row._id) : setSelectedUserId(null)
                                        // setPopupstate2(prev => !prev)

                                    }}>Edit</button>

                                </td>
                                <td>
                                    <button className='btn btn-danger btn-sm' onClick={() => {
                                        // console.log(row._id);
                                        deleteUserFn(row._id)
                                    }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {selectedUserId && (
                    <div className="popup-cont">
                        <div className='heading-popup'>
                            <h5 className='' >Edit User</h5>
                            {/* <input type="button" className='btn-user' id='close' */}
                            <Button variant="outline-danger" onClick={() => {
                                setSelectedUserId(null)
                            }}>x</Button>
                        </div>

                        {console.log('passed-------------------------: ', selectedUserId)}
                        <EditUserDetails _id={selectedUserId} reloade={getUsersFn} par={'edit'} />
                    </div>
                )}
            </MainCard>


        </>
    );
}