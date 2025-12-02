import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import axiosInstance from './axiosIntercepter.js';

// bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

// formik + yup
import * as formik from 'formik';
import * as yup from 'yup';

export function UpdatePassword() {

    const navigate = useNavigate();
    const { theam, setTheam } = useContext(StateContext);
    const { Formik } = formik;

    const changeTheamFn = () => {
        theam === 'dark' ? setTheam('light') : setTheam('dark');
    };

    // validation schema
    const schema = yup.object().shape({
        usersname: yup.string().required('Username cannot be empty'),
        password: yup.string().required('Password cannot be empty'),
        newPassword: yup.string().required('New password cannot be empty')
    });

    const updatePasswordFn = async (values) => {
        try {
            const result = await axiosInstance.patch('/updatepassword', values, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (result.status === 201) {
                alert("Password updated successfully");
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "/login";
            }

        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="container mt-4" style={{maxWidth: '450px', backgroundColor: '#fff', padding: '20px'}}>
            <div className="d-flex justify-content-center align-items-center mb-3">
                <h3>Update Password</h3>
                {/* <img className="themIcon" src="./contrast.png" alt="theme" onClick={changeTheamFn} /> */}
            </div>

            <Formik
                validationSchema={schema}
                initialValues={{
                    usersname: '',
                    password: '',
                    newPassword: ''
                }}
                onSubmit={(values) => updatePasswordFn(values)}
            >
                {({ handleSubmit, handleChange, values, errors, touched }) => (
                    <Form noValidate onSubmit={handleSubmit}>

                        {/* Username */}
                        <Form.Group className="mb-3" controlId="usersname">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="usersname"
                                value={values.usersname}
                                onChange={handleChange}
                                isInvalid={touched.usersname && !!errors.usersname}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.usersname}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Old Password */}
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={touched.password && !!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* New Password */}
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={values.newPassword}
                                onChange={handleChange}
                                isInvalid={touched.newPassword && !!errors.newPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.newPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Update Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default UpdatePassword;
