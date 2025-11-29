import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './App.jsx';
import axios from 'axios';
import PropTypes from 'prop-types';
// import { useState } from 'react';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';

// third-party
import { useForm } from 'react-hook-form';

// project-imports
import MainCard from '../components/MainCard.jsx';
import { emailSchema, passwordSchema } from '../utils/validationSchema.js';

// assets
import DarkLogo from '../assets/images/logo-dark.svg';

function Login({ className='', link }) {

  const navigate = useNavigate()
  const { tokens, setTokens, theam, setTheam } = useContext(StateContext)
  const [errorMessage, setErrorMessage] = useState({
    usersname: '',
    password: ''
  })
  const [data, setData] = useState({
    usersname: '',
    password: ''
  })
  // useEffect(() => {
  //     console.log("data in login: ", data)
  // }, [data])

  const changeTheamFn = () => {
    theam == 'dark' ? setTheam('light') : setTheam('dark');

  }
  // useEffect(async () => {
  //     if (!tokens.accessToken && tokens.refreshToken.length >= 3) {
  //         const result = await axios.post('http://localhost:4000/refresh', {}, {
  //             headers: { 'refreshToken': tokens.refreshToken }
  //         })
  //         if (result.data.status == 201) {
  //             sessionStorage.setItem('accessToken', result.data.accessToken)
  //             navigate('/home')
  //         }
  //     }
  // }, []);

  // const accessToken = sessionStorage.getItem('accessToken');
  // const refreshToken = localStorage.getItem('refreshToken');
  // if (accessToken || refreshToken) {
  //     setTokens({ accessToken, refreshToken });
  // }

  function checkValidetion() {
    let InvalidFields = {}
    if (data.usersname == '') {
      InvalidFields.usersname = 'Username Sould not be empty'
    }
    if (data.password == '') {
      InvalidFields.password = 'password Sould not be empty'
    }
    setErrorMessage(InvalidFields)
    return Object.keys(InvalidFields).length === 0
  }


  const loginFn = async (e) => {
    e.preventDefault()
    try {
      const check = checkValidetion()
      if (!check) return console.log('Feilds are empty')

      const result = await axios.post('http://localhost:4000/login', data, {
        headers: { 'Content-Type': 'application/json' }
      })
      console.log(result);

      // console.log(result.data.message, result.status)
      if (result.status == 200) {
        console.log(result.data.message)
        sessionStorage.setItem('accessToken', result.data.accessToken)
        localStorage.setItem('refreshToken', result.data.refreshToken)

        setTokens((prev) => ({
          ...prev,
          'accessToken': result.data.accessToken,
          'refreshToken': result.data.refreshToken
        }))

        navigate('/home')

      } else {
        console.log("Unexpected response:", result.status)
      }
    } catch (error) {

      if (error.response) {

        // USER NOT ACTIVE
        if (error.response.status === 422) {
          console.log('you are not active: ', error.response.data.message)
        }

        // WRONG PASSWORD
        else if (error.response.status === 401) {
          console.log(' Password or username is wrong')
        }

        // USER NOT FOUND
        else if (error.response.status === 404) {
          console.log('user not found: ', error.response.data.message)
        }

        // EMPTY FIELDS ERROR
        else if (error.response.status === 400) {
          console.log('empty feils: ', error.response.data.message)
        }

        // ANY OTHER SERVER ERROR
        else {
          console.log('Server error: ', error.response.data.message)
        }
      }

      //  NETWORK OR AXIOS ERROR (server off, CORS, connection lost)
      else {
        console.log('Network Error in Login.jsx: ', error)
      }
    }
  }

  // for ui to work
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = () => {
    // reset();
    console.log('called');
    
  };


  return (
    <MainCard className="mb-0" >
      <div className="text-center">
        <a>
          <Image src={DarkLogo} alt="img" style={{height:'30px'}} /> Demo
        </a>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Login</h4>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Email Address"
            {...register('email', emailSchema)}
            isInvalid={!!errors.email}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', passwordSchema)}
              isInvalid={!!errors.password}
              className={className && 'bg-transparent border-white text-white border-opacity-25 '}
            />
            <Button onClick={togglePasswordVisibility}>
              {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
          </InputGroup>
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        <Stack direction="horizontal" className="mt-1 justify-content-between align-items-center">
          <Form.Group controlId="customCheckc1">
            <Form.Check
              type="checkbox"
              label="Remember me?"
              defaultChecked
              className={`input-primary ${className ? className : 'text-muted'} `}
            />
          </Form.Group>
          <a href="#!" className={`text-secondary f-w-400 mb-0  ${className}`}>
            Forgot Password?
          </a>
        </Stack>
        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4">
            Login
          </Button>
        </div>
        <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Don't have an Account?</h6>
          <a href={link} className="link-primary">
            Create Account
          </a>
        </Stack>
      </Form>
    </MainCard>
  );

}
export default Login