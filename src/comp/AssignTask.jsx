import React, { useState, useEffect } from 'react';
import MainCard from '../components/MainCard';
import Form from 'react-bootstrap/Form';
import axiosInstance from './axiosIntercepter';
import { toast } from "react-toastify";
import { Button, InputGroup } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

// import 
import '../index.scss'

export function AssignTask({ taskId_prop, reloade }) {


    const [data, setData] = useState([])
    const [searching, setSearching] = useState({
        name: ''
    });
    const [storeData, setStoreData] = useState({
        taskId: taskId_prop,
        userId: {},
        role: undefined, //default essigne 
        addedBy: undefined, // add in backend   
    })

    let handelClick = async (e) => {
        e.preventDefault();

        if (!searching.name) {
            toast.error("Please select a user");
            return;
        }

        if (!storeData.userId) {
            toast.error("Please select a user");
            return;
        }

        try {
            await axiosInstance.post('/assigntask', storeData);
            toast.success("Task assigned successfully");
            reloade();
        } catch (error) {
            console.log('check:---', error);
            if (error.response?.status === 400) {
                toast.error("Feild/s are empty");
                return;
            }
            if (error.response?.status === 409) {
                toast.info("Already Assigned");
                return;
            }
            toast.error("Failed to assign task");
        }
    };


    const fetchAllUsersWithRoleUser = async (e) => {
        const value = e.target.value;

        setSearching(prev => ({ ...prev, name: value }));

        if (value.length < 2) {
            setData([]);
            return;
        }

        try {
            const result = await axiosInstance.post('/allroleusers', {
                name: value
            });

            setData(result.data.usersList || []);

        } catch (error) {
            if (error.response?.status === 404) {
                setData([]);
            } else {
                console.error(error);
                toast.error("Failed to fetch users");
            }
        }
    };


    useEffect(() => {
        console.log(searching);

    }, [searching])


    useEffect(() => {
        console.log("data from server: ", data)
    }, [data])

    // const [data, setData] = useState({
    //     taskId: taskId,
    //     userId: '',
    //     role: '',
    //     addedBy: '',
    // })

    return (
        <>
            <MainCard className="mb-0">

                <Form noValidate>
                    {/* name */}
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Search Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={searching.name || ""}
                            onChange={fetchAllUsersWithRoleUser}
                        />
                    </Form.Group>

                    <Form.Select className="mb-3" onChange={(e) => {
                        setStoreData((prev) => ({
                            ...prev,
                            userId: e.target.value
                        }))
                    }}>
                        <option>Open this select user</option>
                        {/* {console.log(data)} */}
                        {data.map((ele) => (
                            <option key={ele._id} value={ele._id}>{ele.name}</option>
                        ))}

                    </Form.Select>

                    <button className="w-100 btn btn-primary" style={{ fontSize: '110%' }} onClick={handelClick}>Save</button>

                </Form>

            </MainCard>
        </>
    );
}