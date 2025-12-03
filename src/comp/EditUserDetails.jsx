import React, { useState, useEffect } from 'react';
import MainCard from '../components/MainCard';
import Form from 'react-bootstrap/Form';
import api from './axiosIntercepter';
import { toast } from "react-toastify";

// import 
import '../index.scss'


export function EditUserDetails({ _id ,reloade}) {

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
        const result = await api.patch('/updateuser', data)
        if (result.status == 200) {
            toast.success(result.data.message)
            reloade()
        } else {
            toast.error(result?.response?.data?.message)
        }
    }

    return (
        <>
            <MainCard className="mb-0" >
                <Form noValidate>

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
                        <Form.Control
                            type="password"
                            name="password"
                            value={data.password || ""}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    password: e.target.value
                                }))
                            }
                        />
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
                                    status: e.target.value === "true" // convert string -> boolean
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

                    <button className="w-100 btn btn-primary" onClick={updateUserFn}>Update UsersData</button>

                    {/* <button className="w-100 btn btn-primary" onClick={(e) => {
                        updateUserFn(e)
                    }}></button> */}

                </Form>
            </MainCard>
        </>
    );
}