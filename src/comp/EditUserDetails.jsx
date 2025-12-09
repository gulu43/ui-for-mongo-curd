import React, { useState, useEffect } from 'react';
import MainCard from '../components/MainCard';
import Form from 'react-bootstrap/Form';
import api from './axiosIntercepter';
import { toast } from "react-toastify";
import { Button, InputGroup } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

// import 
import '../index.scss'

export function EditUserDetails({ _id, reloade, par }) {

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    let handelClick;

    const [userId] = useState(_id);
    useEffect(() => {
        console.log("_id: ", userId)
    }, [userId])

    const [data, setData] = useState({
        _id: userId,
        name: '',
        age: '',
        usersname: '',
        password: '',
        status: '',
        role: ''
    })

    useEffect(() => {
        console.log("data in login: ", data)
    }, [data])

    const updateUserFn = async (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            status: data.status === "true"
        };

        const result = await api.patch('/updateuser', payload)
        if (result.status == 200) {
            toast.success(result.data.message)
            reloade()
        } else {
            toast.error(result?.response?.data?.message)
        }
    }

    const registerFn = async (e) => {
        e.preventDefault()
        try {
            // const check = checkValidetion()

            setData(prev => {
                const { _id, ...rest } = prev;
                return rest;
            });

            const payload = {
                ...data,
                status: data.status === "true"
            };

            if (!data.name || !data.age || !data.usersname || !data.password || !data.status || !data.role) return toast.error('Feild/s are empty')


            // const result = await api.post('http://localhost:4000/register', payload, {
            const result = await api.post('/register', payload, {
                headers: { 'Content-Type': 'application/json' }
            })

            console.log(result.data.message, result.status)
            if (result.status == 201) {
                // console.log(result.data.message);
                toast.success(`User added`)
            }
            reloade()

        } catch (error) {

            if (error.status == 400) {
                console.log(error.response.data.message)
                toast.error(error.response.data.message)
            }
            else if (error.status == 401) {
                console.log('Error: ', error.response.data?.message || 'Fields Should not be empty')
                console.log('Status:', error.response.status)
            } else {
                console.log(`Network error in register.jsx: ${error}` || 'something went rong')
            }
        }
    }

    if (par == 'add') {
        handelClick = registerFn
    } else {
        handelClick = updateUserFn

    }

    return (
        <>
            <MainCard className="mb-0">
                <Form noValidate>
                    {/* <div>Check: {par}</div> */}
                    {/* { name, age(number), usersname, password, status(boolean), role[admin or user] }  */}

                    {/* name */}
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={data.name || ""}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    name: e.target.value
                                }))
                            }
                        />
                    </Form.Group>

                    {/* age */}
                    <Form.Group className="mb-3" controlId="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                            type="number"
                            name="age"
                            value={data.age || ""}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    age: Number(e.target.value)
                                }))
                            }
                        />
                    </Form.Group>

                    {/* usersname */}
                    <Form.Group className="mb-3" controlId="usersname">
                        <Form.Label>Usersname</Form.Label>
                        <Form.Control
                            type="text"
                            name="usersname"
                            value={data.usersname || ""}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    usersname: e.target.value
                                }))
                            }
                        />
                    </Form.Group>

                    {/* password */}
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password || ""}
                                onChange={(e) =>
                                    setData((prev) => ({
                                        ...prev,
                                        password: e.target.value
                                    }))
                                }
                            />
                            <Button onClick={togglePasswordVisibility}>
                                {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    {/* status (boolean) */}
                    <Form.Group className="mb-3" controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={data.status || ""}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    status: e.target.value
                                }))
                            }
                        >
                            <option value="">Select</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </Form.Select>
                    </Form.Group>

                    {/* role (admin or user) */}
                    <Form.Group className="mb-3" controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            name="role"
                            value={data.role || ""}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    role: e.target.value
                                }))
                            }
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </Form.Select>
                    </Form.Group>

                    <button className="w-100 btn btn-primary" style={{ fontSize: '110%' }} onClick={handelClick}>Save</button>

                    {/* <button className="w-100 btn btn-primary" onClick={(e) => {
                        updateUserFn(e)
                    }}></button> */}

                </Form>
            </MainCard>
        </>
    );
}