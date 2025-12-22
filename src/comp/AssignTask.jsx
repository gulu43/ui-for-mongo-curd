import React, { useState, useEffect } from 'react';
import MainCard from '../components/MainCard';
import Form from 'react-bootstrap/Form';
import axiosInstance from './axiosIntercepter';
import { toast } from "react-toastify";
import { Dropdown } from 'primereact/dropdown';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import '../index.scss';

export function AssignTask({ taskId_prop, reloade }) {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const roles = [
        { label: 'Assignee', value: 'assignee' },
        // { label: 'Watcher', value: 'watcher' }
    ];
    const [selectedRole, setSelectedRole] = useState(roles[0].value);

    // Fetch users once
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get('/getuser');
                setUsers(res.data?.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch users");
            }
        };
        fetchUsers();
    }, []);

    const handelClick = async (e) => {
        e.preventDefault();

        if (!selectedUser) {
            toast.error("Please select a user");
            return;
        }

        if (!selectedRole) {
            toast.error("Please select a role");
            return;
        }

        const payload = {
            taskId: taskId_prop,
            userId: selectedUser._id,
            role: selectedRole
        };

        try {
            setLoading(true);
            await axiosInstance.post('/assigntask', payload);
            toast.success("Task assigned successfully");
            reloade();
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error("Fields are required");
                return;
            }
            if (error.response?.status === 409) {
                toast.info("User already assigned");
                return;
            }
            toast.error("Failed to assign task");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <MainCard className="mb-0">
            <Form noValidate>

                {/* User Dropdown */}
                <div className="mb-3">
                    <Dropdown
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.value)}
                        options={users}
                        optionLabel="name"
                        placeholder="Select User"
                        filter
                        className="w-100"
                    />
                </div>

                {/* Role Dropdown */}
                <div className="mb-3" style={{display: 'none'}}>
                    <Dropdown
                        disabled
                        value={roles[0].value}
                        // value={selectedRole}
                        onChange={(e) => setSelectedRole(e.value)}
                        options={roles}
                        optionLabel="label"
                        placeholder="Select Role"
                        className="w-100"
                    />
                </div>
               
                {/* Save Button */}
                <button
                    className="w-100 btn btn-primary"
                    style={{ fontSize: '110%' }}
                    onClick={handelClick}
                    disabled={loading}
                >
                    {loading ? 'Assigning...' : 'Save'}
                </button>

            </Form>
        // </MainCard>
    );
}
