import React, { useState, useEffect } from 'react';
import MainCard from '../components/MainCard.jsx';
import { toast } from 'react-toastify';
import api from './axiosIntercepter.js';
import '../App.css'
import '../index.scss'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import '../../src/App.css'
import { useRef } from 'react';


export function CreateTask() {
    const currentDate = new Date()

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String((date.getDate() + 1)).padStart(2, "0");
        const ToDay = String((date.getDate())).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    const currentDateFn = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const ToDay = String((date.getDate())).padStart(2, "0");
        return `${year}-${month}-${ToDay}`;
    }
    // console.log(formatDate(currentDate));

    let ref = useRef(formatDate(currentDate))
    let refCurrent = useRef(currentDateFn(currentDate))

    // console.log('ref', ref);



    const [data, setData] = useState({

        title: '',
        description: '',
        priority: '' || 'medium',
        dueDate: '' || ref.current,

        status: '',
        isAssigned: '',
        createdBy: `${localStorage.getItem('usersname')}`,
        UpdatedBy: '',
        isDeleted: '',

    })
    if (data.dueDate < refCurrent.current) {
        toast.error('date can not be of past')
        setData((prev) => ({
            ...prev,
            dueDate: refCurrent.current
        }))
    }
    useEffect(() => {
        console.log("data in login: ", data)
    }, [data])

    const handleCLick = (e) => {
        e.preventDefault()

        if (!data.title || !data.description || !data.priority || !data.dueDate) {
            console.log(data.title);
            console.log(data.description);
            console.log(data.priority);
            console.log(data.dueDate);

            toast.error('Fields should not be empty')
        }
        if (data.title.length < 3 || data.description < 3) {
            toast.error('Alteast 3 charater should be in feild/s')
        }

    }
    return (
        <>
            <MainCard className="mb-0"  >
                <div className='flex-between'>
                    <span><b>Users Data</b> </span>

                    {/* <button variant="outline-danger" type="button" className="btn btn-primary btn-sm" onClick={() => {
                            // setPopupstate(prev => !prev);
                            setVisibleRight(prev => !prev)
                            setOption('add')

                        }}>Edit Task</button> */}
                </div>
                <div>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={data.title}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    title: e.target.value
                                }))
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Description"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    description: e.target.value
                                }))
                            }
                        />
                    </Form.Group>

                </div>
                <div className='contOfPriorityAndDatePicker'>
                    {/* priority (string) */}
                    <Form.Group style={{ maxWidth: '100%' }} className="mb-3" controlId="priority">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                            name="priority"
                            value={data.priority || 'medium'}
                            onChange={(e) =>

                                setData((prev) => ({
                                    ...prev,
                                    priority: e.target.value
                                }))
                            }
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Date */}
                    <Form.Group className="mb-3" controlId="dueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="dueDate"
                            value={data.dueDate || ""}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    dueDate: e.target.value,
                                }))
                            }
                        />
                    </Form.Group>


                </div>
                <span>

                    <Button variant="primary" size="md" onClick={handleCLick}>
                        Create
                    </Button>
                </span>


            </MainCard>
        </>
    );
}