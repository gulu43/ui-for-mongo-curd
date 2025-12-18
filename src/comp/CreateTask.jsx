import React, { useState, useEffect } from 'react';
import MainCard from '../components/MainCard.jsx';
import { toast } from 'react-toastify';
import api from './axiosIntercepter.js';
import '../App.css'
import '../index.scss'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import BootStrapButton from 'react-bootstrap/Button';
import '../../src/App.css'
import { useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';


export function CreateTask({ reloadDataTableFn }) {

    const [files, setFiles] = useState([]);


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

        status: undefined,
        isAssigned: undefined,
        createdBy: undefined,
        UpdatedBy: undefined,
        isDeleted: undefined,

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

    // const handleCLick = async (e) => {
    //     e.preventDefault()

    //     if (!data.title || !data.description || !data.priority || !data.dueDate) {
    //         console.log(data.title);
    //         console.log(data.description);
    //         console.log(data.priority);
    //         console.log(data.dueDate);

    //         toast.error('Fields should not be empty')
    //     }
    //     if (data.title.length < 3 || data.description < 3) {
    //         toast.error('Alteast 3 charater should be in feild/s')
    //     }

    //     const result = await api.post('/createtask', data)
    //     console.log('fn result: ', result);

    //     if (result.status === 201) {
    //         toast.success(result.data.message)
    //         reloadDataTableFn()
    //     } else {
    //         toast.error(result?.response?.data?.message)
    //     }

    // }

    const handleCLick = async (e) => {
        e.preventDefault();

        if (!data.title || !data.description || !data.priority || !data.dueDate) {
            toast.error('Fields should not be empty');
            return;
        }

        if (data.title.length < 3 || data.description.length < 3) {
            toast.error('At least 3 characters required');
            return;
        }

        const formData = new FormData();

        // text fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('priority', data.priority);
        formData.append('dueDate', data.dueDate);

        // files
        if (files.length > 0) {
            files.forEach(file => {
                formData.append('attachments', file);
            });
        }

        try {
            const result = await api.post('/createtask', formData);

            if (result.status === 201) {
                toast.success(result.data.message);
                reloadDataTableFn();
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Error creating task');
        }
    };
    const chooseOptions = {
        icon: 'pi pi-fw pi-images',
        iconOnly: true,
        className: 'custom-choose-btn p-button-rounded p-button-outlined'
    };

    // 2. Configure the "Cancel" button (Icon only, danger color, rounded, outlined)
    const cancelOptions = {
        icon: 'pi pi-fw pi-times',
        iconOnly: true,
        className: 'custom-cancel-btn p-button-rounded p-button-danger p-button-outlined'
    };

    // 3. Define the Header Template to arrange the buttons
    const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;
        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    };
    // const headerTemplate1 = (options) => {
    //     const { className, chooseButton, cancelButton } = options;
    //     return (
    //         <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
    //             {chooseButton}
    //             {cancelButton}
    //         </div>
    //     );
    // };
    return (
        <>
            {/* <MainCard className="mb-0"  > */}
            <div className='flex-between'>
                {/* <span><b>Create Task</b> </span> */}

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

            <div className="card">
                <FileUpload

                    name="attachments"
                    multiple
                    customUpload
                    auto={false}
                    headerTemplate={headerTemplate}
                    chooseOptions={chooseOptions}
                    cancelOptions={cancelOptions}
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    maxFileSize={5 * 1024 * 1024}
                    onSelect={(e) => {
                        setFiles(e.files);
                    }}
                    emptyTemplate={
                        <p className="m-0">
                            Drag and drop files here to attach
                        </p>
                    }
                />
            </div>

            <span>

                <BootStrapButton variant="primary" size="md" onClick={handleCLick}>
                    Create
                </BootStrapButton>
            </span>


            {/* </MainCard> */}
        </>
    );
}