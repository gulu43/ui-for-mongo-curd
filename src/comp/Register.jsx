import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import axios from 'axios';
// import '../App.css'

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';

// third-party
import { useForm } from 'react-hook-form';
import { confirmPasswordSchema, emailSchema, firstNameSchema, lastNameSchema, passwordSchema } from '../utils/validationSchema';
import PropTypes from 'prop-types';

// project-imports
import MainCard from '../components/MainCard';

// assets
import DarkLogo from '../assets/images/logo-dark.svg';

export function Register({ className = '', link = '' }) {

    const navigate = useNavigate()
    const { tokens, setTokens, theam, setTheam } = useContext(StateContext)
    const [errorMessage, setErrorMessage] = useState({
        name: '',
        age: '',
        usersname: '',
        password: ''
    })
    const [data, setData] = useState({
        name: '',
        age: 0,
        usersname: '',
        password: ''
    })
    useEffect(() => {
        console.log("data in login: ", data)
    }, [data])

    const changeTheamFn = () => {
        theam == 'dark' ? setTheam('light') : setTheam('dark');

    }
    function checkValidetion() {
        let InvalidFields = {}
        if (data.name == '') {
            InvalidFields.name = 'Name Sould not be empty'
        }
        if (data.age == -1 || data.age <= 13) {
            InvalidFields.age = 'Age Sould not be empty or less than 13'
        }
        if (data.usersname == '') {
            InvalidFields.usersname = 'Username Sould not be empty'
        }
        if (data.password == '') {
            InvalidFields.password = 'Password Sould not be empty'
        }
        setErrorMessage(InvalidFields)
        return Object.keys(InvalidFields).length === 0
    }
    const registerFn = async (e) => {
        e.preventDefault()
        try {
            const check = checkValidetion()
            if (!check) return console.log('Feild/s are empty')

            const result = await axios.post('http://localhost:4000/register', data, {
                headers: { 'Content-Type': 'application/json' }
            })

            console.log(result.data.message, result.status)

            navigate('/login')
            // }
        } catch (error) {

            if (error.status == 400) {
                console.log(error.response.data.message)
            }
            else if (error.status == 401) {
                console.log('Error: ', error.response.data?.message || 'Fields Should not be empty')
                console.log('Status:', error.response.status)
            } else {
                console.log(`Network error in register.jsx: ${error}` || 'something went rong')
            }
        }
    }

    // copyed

    const [showPassword, setShowPassword] = useState(false);
    // const {
    //     register,
    //     handleSubmit,
    //     reset,
    //     formState: { errors },
    //     setError,
    //     clearErrors
    // } = useForm();

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const onSubmit = (data= 'ok') => {
        console.log('register ok',data);

    };

    return (

        <MainCard className="mb-0">
            <div className="text-center">
                <a>
                    <Image src={DarkLogo} alt="img" style={{ height: '30px' }} /> Demo
                </a>
            </div>
            <Form >
                <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Sign up</h4>

                <Col>
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            // {...register('firstName', firstNameSchema)}
                            onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    name: e.target.value
                                }))
                            }}
                            isInvalid={!!errorMessage.name}
                            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                        />
                        {/* <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback> */}
                    </Form.Group>
                </Col>

                <Col >
                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Control
                            type="number"
                            placeholder="Age"
                            // {...register('lastName', lastNameSchema)}
                            onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    age: e.target.value
                                }))
                            }}
                            isInvalid={!!errorMessage.age}
                            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                        />
                        {/* <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback> */}
                    </Form.Group>
                </Col>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control
                        type="text"
                        placeholder="Usersname"
                        // {...register('email', emailSchema)}
                        onChange={(e) => {
                            setData((prev) => ({
                                ...prev,
                                usersname: e.target.value
                            }))
                        }}
                        isInvalid={!!errorMessage.usersname}
                        className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                    />
                    {/* <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback> */}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            // {...register('password', passwordSchema)}
                            onChange={(e) => {
                                setData((prev) => ({
                                    ...prev,
                                    password: e.target.value
                                }))
                            }}
                            isInvalid={!!errorMessage.password}
                            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                        />
                        <Button onClick={togglePasswordVisibility}>
                            {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
                        </Button>
                        {/* <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback> */}
                    </InputGroup>
                </Form.Group>

                {/* <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        // {...register('confirmPassword', confirmPasswordSchema)}
                        //onCLick
                        isInvalid={!!errorsMessage.confirmPassword}
                        className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                </Form.Group> */}

                <Stack direction="horizontal" className="mt-1 justify-content-between">
                    <Form.Group controlId="customCheckc1">
                        <Form.Check
                            type="checkbox"
                            label="I agree to all the Terms & Condition"
                            defaultChecked
                            className={`input-primary ${className ? className : 'text-muted'} `}
                        />
                    </Form.Group>
                </Stack>
                <div className="text-center mt-4">
                    <div className="text-center mt-4">
                        <input type='button' className="btn btn-primary shadow px-sm-4" value='Sign up' onClick={(e) => { registerFn(e) }} />
                    </div>
                </div>
                <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
                    <h6 className={`f-w-500 mb-0 ${className}`}>Already have an Account?</h6>
                    <a href={link} className="link-primary">
                        Login
                    </a>
                </Stack>
            </Form>
        </MainCard>

    );
}