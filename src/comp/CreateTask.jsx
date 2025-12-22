import { useState, useEffect, useRef } from 'react';
import MainCard from '../components/MainCard.jsx';
import api from './axiosIntercepter.js';

import { toast } from 'react-toastify';

import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import BootStrapButton from 'react-bootstrap/Button';

import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method

import '../App.css'
import '../../src/App.css'
import '../index.scss'
import 'primeicons/primeicons.css';


export function CreateTask({ reloadDataTableFn, editingRowData, exisitingFiles, par }) {

    const [files, setFiles] = useState([]);
    const [removedFileIds, setRemovedFileIds] = useState([]);
    const [existingFilesState, setExistingFiles] = useState(exisitingFiles || []);

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

        title: editingRowData.title || '',
        description: editingRowData.description || '',
        priority: editingRowData.priority || 'medium',
        dueDate: editingRowData?.dueDate?.split('T')[0] || ref.current,

        status: editingRowData.status || undefined,
        isAssigned: editingRowData.isAssigned || undefined,
        createdBy: editingRowData.createdBy || undefined,
        UpdatedBy: localStorage.getItem('name') || undefined,
        isDeleted: editingRowData.isDeleted || undefined,

    })
    if (par == 'create') {

        if (data.dueDate < refCurrent.current) {
            toast.error('date can not be of past')
            setData((prev) => ({
                ...prev,
                dueDate: refCurrent.current
            }))
        }
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

        if (par == 'create') {

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


        } else {

            e.preventDefault();

            if (!data.title || !data.description || !data.priority || !data.dueDate || !data.status 
            ) {
                console.log('brfore validetion: ',data);
                
                toast.error('Fields should not be empty');
                return;
            }

            if (data.title.length < 3 || data.description.length < 3) {
                toast.error('At least 3 characters required');
                return;
            }

            const formData = new FormData();

            // text fields
            formData.append('_id', editingRowData._id);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('priority', data.priority);
            formData.append('dueDate', data.dueDate);
            formData.append('status', data.status);
            formData.append('isAssigned', data.isAssigned);

            // files
            if (files.length > 0) {
                files.forEach(file => {
                    formData.append('attachments', file);
                });
            }

            // removing File arry
            if (removedFileIds.length > 0) {
                removedFileIds.forEach(rFileId => {
                    formData.append('removedFileIds', rFileId);
                });
            }

            try {
                const result = await api.patch('/updatetask', formData);

                if (result.status === 200) {
                    toast.success(result.data.message);
                    reloadDataTableFn();
                }
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Error updating task');
            }
        }

    }
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

    const accept = (rowData) => {
        setExistingFiles(prev =>
            prev.filter(f => f._id !== rowData._id)
        )
        setRemovedFileIds(prev => [...prev, rowData._id])
    }

    const reject = () => {
        toast.error('You have Cancelled');
    }

    const confirmDelete = (rowData) => {
        confirmDialog({
            message: 'Do you want to delete this file?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => accept(rowData),
            reject
        });
    };

    const removeTemplate = (rowData) => {

        return (
            <>
                <Button icon="pi pi-trash" rounded outlined severity="danger"
                    onClick={() => confirmDelete(rowData)}
                />
            </>
        )
    }

    useEffect(() => {
        if (par === 'edit' && Array.isArray(exisitingFiles)) {
            setExistingFiles(exisitingFiles);
            setRemovedFileIds([]);
        }
    }, [exisitingFiles, par]);


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

            {par == 'edit' && <div className='contOfPriorityAndDatePicker'>
                {/* Status (string) */}
                <Form.Group style={{ maxWidth: '100%' }} className="mb-3" controlId="priority">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={data.status || ''}
                        // value={editingRowData?.status || ''}
                        onChange={(e) => {

                            // editingRowData.status = e.target.value

                            setData((prev) => ({
                                ...prev,
                                status: e.target.value
                            }))
                        }}
                    >
                        <option value="created">created</option>
                        <option value="in_progress">In Progess</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </Form.Select>
                </Form.Group>

                {/* Date */}
                <Form.Group className="mb-3" controlId="dueDate">
                    <Form.Label>Assigned</Form.Label>
                    <Form.Select
                        name="assigned"
                        // value={editingRowData.isAssigned || ""}
                        value={String(data.isAssigned)}

                        onChange={(e) => {
                            // editingRowData.isAssigned = e.target.value
                            setData((prev) => ({
                                ...prev,
                                isAssigned: e.target.value === 'true'
                            }))
                        }
                        }
                    >
                        <option value={false}>False</option>
                        <option value={true}>True</option>
                    </Form.Select>
                </Form.Group>


            </div>}

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
                <Form.Group className="mb-3" controlId="dueDate" style={{ maxWidth: '135px' }}>
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

            {par == 'edit' && existingFilesState?.length > 0 && (
                <div className='existingFiles'>

                    <DataTable header={'Existing Attachments'} value={existingFilesState} size='small' stripedRows emptyMessage="No File found." tableStyle={{ width: '100%' }}>
                        <Column field="fileName" header="File name" width={'90%'}></Column>
                        <Column header="delete" body={removeTemplate} width={'10%'}>times-circle</Column>

                    </DataTable>
                </div>
            )}


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
                    // onSelect={(e) => {
                    //     setFiles(e.files);
                    // }}
                    onSelect={(e) => {
                        setFiles(prev => [...prev, ...e.files]);
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
                    {par === 'edit' ? 'Update' : 'Create'}
                </BootStrapButton>

            </span>


            {/* </MainCard> */}
        </>
    );
}