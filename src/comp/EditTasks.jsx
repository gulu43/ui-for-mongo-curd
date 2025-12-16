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
import { EditUserDetails } from './EditUserDetails.jsx';
import { toast } from "react-toastify";
// import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Button as ButtonPR } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method
import { Dialog } from 'primereact/dialog';
import { CreateTask } from './CreateTask.jsx';
import { Tag } from 'primereact/tag';
import { AssignTask } from './AssignTask.jsx';


export function EditTasks() {
    const [usersData, setUsersData] = useState([])
    const [popupstate, setPopupstate] = useState(false)
    const [option, setOption] = useState('')
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [visibleRight, setVisibleRight] = useState(false);
    const [currentEditData, setCurrentEditData] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false)

    const getTasksFn = async () => {
        setLoading(true)
        const result = await axiosInstance.get('/gettasks', {})
        setUsersData(result.data.allTasks)
        setLoading(false)
    }
    
    useEffect(() => {
        getTasksFn()
    }, [])

    const deleteTaskFn = async (id) => {

        setLoading(true)
        const response = await axiosInstance.delete('/deletetask', {
            data: { taskId: id }
        })
        // console.log(response);
        if (response.status == 200) {
            toast.success(response.data.message)
            setLoading(false)
            getTasksFn()
        } else {
            setLoading(false)
            toast.error(response?.data?.message || "Something went wrong")
        }

    }

    // filtters thing
    // 1. State for the ACTUAL filter applied to the table
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    // 2. State for the TEMPORARY input text (what the user sees while typing)
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onInputChange = (e) => {
        const value = e.target.value;

        setGlobalFilterValue(value);

        const _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end align-items-center gap-2">
                {/* Input updates local state only */}
                <InputText
                    value={globalFilterValue}
                    onChange={onInputChange}
                    // onChange={(e) => setGlobalFilterValue(e.target.value)}
                    placeholder="Search"
                />
            </div>
        )
    }
    const header = renderHeader();

    const assignTaskBtnTemplate = (rowData) => {
        return (
            <Button
                variant="primary"
                size="sm"
                onClick={() => {
                    // console.log(rowData._id)
                    setSelectedUserId(rowData._id);
                    setVisibleRight(prev => !prev)
                    setOption('assign')
                }}>
                Assign
            </Button>
        )
    }
    const editBodyTemplate = (rowData) => {
        return (
            <Button
                variant="warning"
                size="sm"
                onClick={async () => {
                    setSelectedUserId(rowData._id);
                    const result = await axiosInstance.post('/gettaskspost', { _id: rowData._id })

                    setCurrentEditData(result.data.allTasks)
                    setVisibleRight(prev => !prev)
                    setOption('edit')

                }}>
                Edit
            </Button>
        );
    };

    const accept = (id) => {
        // toast.success('You have accepted');
        deleteTaskFn(id)
    }

    const reject = () => {
        toast.error('You have rejected');
    }

    const confirmDelete = (id) => {
        confirmDialog({
            message: 'Do you want to delete this Task?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => accept(id),
            reject
        });
    };

    const deleteBodyTemplate = (rowData) => {

        // console.log('Delete Id: ',rowData.title)
        return (
            <Button
                variant="danger"
                size="sm"
                // onClick={() => deleteUserFn(rowData._id)}
                onClick={() => confirmDelete(rowData._id)}
            >
                Delete
            </Button>
        );
    };

    // const softDeleteTemplate = (rowData) => {
    //     return rowData.status === true ? "Deleted" : "Not Delete";
    // };

    const assignStatusBodyTemplate = (rowData) => {
        console.log('check: ',rowData);
        
        return rowData.isAssigned === true ? "Assigned" : "Not Assigned";
    };

    const headerForDrawer = (op) => {
        return (
            <div className="heading-popup">
                <div className='heading-txt'>{op === 'assign' ? "Assign Task" : "Edit User"}</div>
            </div>
        );
    }

    const getPrioritySeverity = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'danger';
            case 'high':
                return 'warning';
            case 'medium':
                return 'info';
            case 'low':
                return 'success';
            default:
                return null;
        }
    };

    const priorityBodyTemplate = (rowData) => {
        return (
            <Tag
                value={rowData.priority.toUpperCase()}
                severity={getPrioritySeverity(rowData.priority)}
            />
        );
    };

    const descriptionBodyTemplate = (rowData) => {
        let des = rowData.description
        const shortDescription = des.slice(0, 65).concat('...')
        if (des.length > 65) {
            return (
                <div>
                    {shortDescription}
                </div>
            )
        }
        else {
            return (
                <div>
                    {des}
                </div>
            )
        }
    }

    const dateDDMMYY = (rowData) => {
        let oldFormat = rowData?.createdAt || '0000-00-00T'
        let dateOnly = oldFormat.split("T")[0]
        let [year, month, day] = dateOnly.split("-")
        let newFormat = `${day}/${month}/${year}`
        return newFormat

    };

    return (
        <>
            <ConfirmDialog />
            <Sidebar header={headerForDrawer(option)} visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                {option === 'assign' ? <AssignTask taskId_prop={selectedUserId} reloade={getTasksFn} /> : <EditUserDetails _id={selectedUserId} reloade={getTasksFn} par={'edit'} editingRowData={currentEditData} />}
            </Sidebar>

            <MainCard >
                <span className='Add-Feth-cont' id='toggle-btn'>
                    <div className='flex-between'>
                        <span><b>Tasks Data</b> </span>

                        <Button variant="" type="button" className="btn btn-primary btn-sm" onClick={() => {
                            setVisible(prev => !prev)

                        }}>Add Task</Button>

                        <Dialog header="Header" visible={visible} onHide={() => { if (!visible) return; setVisible(false); }}
                            style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                            <CreateTask reloadDataTableFn={getTasksFn} />
                        </Dialog>


                    </div>
                </span>

                {/* <div className=""> */}
                <DataTable value={usersData} loading={loading} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                    scrollable scrollHeight="65vh"
                    header={header}
                    filters={filters}
                    globalFilterFields={['title', 'priority', 'dueDate', 'createdBy.usersname', 'status']}
                    emptyMessage="No task found."
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    className="custom-paginator-table"

                    tableStyle={{ minWidth: '50rem', width: '100%' }}
                >

                    {/* <Column field="userId" header="Sl.no." style={{ width: 'auto' }}></Column> */}
                    <Column header="SL No" body={(rowData, options) => options.rowIndex + 1} />
                    <Column field="title" header="Title" style={{ width: 'auto' }}></Column>
                    <Column header="Description" body={descriptionBodyTemplate} style={{ width: '15%' }}></Column>
                    <Column field="status" header="Status" style={{ width: 'auto' }}></Column>
                    <Column header="Due-Date" body={dateDDMMYY} style={{ width: 'auto' }}></Column>
                    <Column field="createdBy.usersname" header="CreatedBy" style={{ width: 'auto' }}></Column>
                    <Column header="Priority" body={priorityBodyTemplate} style={{ width: 'auto' }}></Column>
                    <Column header="Assigned Status" body={assignStatusBodyTemplate} style={{ width: 'auto' }}></Column>
                    {/* <Column field="updatedBy" header="updatedBy" style={{ width: 'auto' }}></Column> */}
                    {/* <Column header="isDeleted" body={softDeleteTemplate} style={{ width: 'auto' }}></Column> */}
                    <Column header="Assign" body={assignTaskBtnTemplate} style={{ textAlign: "center" }} />
                    <Column header="Edit" body={editBodyTemplate} style={{ textAlign: "center" }} />
                    <Column header="Delete" body={deleteBodyTemplate} style={{ textAlign: "center" }} />
                </DataTable>

            </MainCard>
        </>
    );
}