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
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-indigo/theme.css";


export function AllUsers() {
    const [usersData, setUsersData] = useState([])
    const [popupstate, setPopupstate] = useState(false)
    const [popupstate2, setPopupstate2] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)

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
    // buttons
    const editBodyTemplate = (rowData) => {
        return (
            <Button
                variant="warning"
                size="sm"
                onClick={() => {
                    // setSelectedUserId(rowData._id);

                    // console.log('click value of :');
                    // (!selectedUserId) ? setSelectedUserId(rowData._id) : setSelectedUserId(null)
                    setSelectedUserId((prev) =>
                        prev === rowData._id ? null : rowData._id
                    );

                }}
            // onToggle={}
            >
                Edit
            </Button>
        );
    };

    const deleteBodyTemplate = (rowData) => {
        return (
            <Button
                variant="danger"
                size="sm"
                onClick={() => deleteUserFn(rowData._id)}
            >
                Delete
            </Button>
        );
    };
    const statusBodyTemplate = (rowData) => {
        return rowData.status === true ? "Active" : "Inactive";
    };
    const dateDDMMYY = (rowData) => {

        let oldFormat = rowData?.createdAt || '0000-00-00T'
        let dateOnly = oldFormat.split("T")[0]
        let [year, month, day] = dateOnly.split("-")
        let newFormat = `${day}/${month}/${year}`
        return newFormat
    };


    useEffect(() => {
        getUsersFn()
    }, [])

    return (
        <>
            <MainCard >

                <span className='Add-Feth-cont' id='toggle-btn'>
                    <div className='flex-between'>
                        <span><b>Users Data</b> </span>

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

                {/* <div className=""> */}
                <DataTable value={usersData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 

                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    className="custom-paginator-table"

                    tableStyle={{ minWidth: '50rem', width: '100%' }}

                >
                    <Column field="_id" header="id" style={{ width: 'auto' }}></Column>
                    <Column field="name" header="Name" style={{ width: 'auto' }}></Column>
                    <Column field="age" header="Age" style={{ width: 'auto' }}></Column>
                    <Column field="usersname" header="Usersname" style={{ width: 'auto' }}></Column>
                    <Column header="Status" body={statusBodyTemplate} style={{ width: 'auto' }}></Column>
                    <Column field="role" header="Role" style={{ width: 'auto' }}></Column>
                    <Column header="CreatedAt" body={dateDDMMYY} style={{ width: 'auto' }}></Column>
                    <Column header="Edit" body={editBodyTemplate} style={{ textAlign: "center" }} />
                    <Column header="Delete" body={deleteBodyTemplate} style={{ textAlign: "center" }} />
                </DataTable>

                {/* </div> */}
                {selectedUserId && (
                    <div className="popup-cont">
                        <div className='heading-popup'>
                            <h5 className='' >Edit User</h5>
                            {/* <input type="button" className='btn-user' id='close' */}
                            <Button variant="outline-danger" onClick={() => {
                                setSelectedUserId(null)
                            }}>x</Button>
                        </div>

                        {/* {console.log('passed-------------------------: ', selectedUserId)} */}
                        <EditUserDetails key={selectedUserId} _id={selectedUserId} reloade={getUsersFn} par={'edit'} />
                    </div>
                )}



            </MainCard>


        </>
    );
}