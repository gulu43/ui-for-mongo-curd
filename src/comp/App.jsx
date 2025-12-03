import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoutes.jsx'
import { LogOut } from './LogOut.jsx'
import { InvalidRouts } from './InvalidRouts.jsx'
import Login from './Login.jsx'
import { Register } from './Register.jsx'
import { Refresh } from './Refresh.jsx'
import { Home } from './Home.jsx'
import { createContext } from 'react'
import '../App.css'
import { UpdatePassword } from './UpdatePassword.jsx'
import { DelAc } from './DelAc.jsx'
import { setAccessTokenOutside, setNavigator } from "./redirect.js";
import axiosInstance from './axiosIntercepter.js'
import { AllUsers } from './AllUsers.jsx'
import LoginPage from '../views/auth/login/Login.jsx'
import RegisterPage from '../views/auth/register/Register.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { RouterProvider } from 'react-router-dom';
// import router from '../routes/index.jsx';

import MainLayout from '../layout/Dashboard/index.jsx'
import { EditUserDetails } from './EditUserDetails.jsx'

export const StateContext = createContext()

function App() {

  useEffect(() => {
    // console.log('only run first time');

    const check = localStorage.getItem('refreshToken')
    if (check) {
      axiosInstance.get('/me')
        .then(response => {
          console.log(' /me success:', response.data)
        })
        .catch(error => {
          console.log(' /me error:', error)
        })
    }
  }, [])

  const navigate = useNavigate();

  const [theam, setTheam] = useState('dark')

  const [tokens, setTokens] = useState({
    accessToken: sessionStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || ''
  })
  //   useEffect(() => {
  //   if (!tokens.accessToken && tokens.refreshToken) {
  //     axiosInstance.get("/refresh")
  //       .catch(() => navigate("/login"));
  //   }
  // }, [tokens.accessToken, tokens.refreshToken, navigate]);

  useEffect(() => {
    setAccessTokenOutside((accessToken) => {
      console.log('AccessToken value change with setter: ', accessToken);

      setTokens((prev) => ({
        ...prev,
        'accessToken': accessToken
      }))
    })
  }, [])

  useEffect(() => {
    // console.log('accessToken changed', tokens.accessToken)
    // console.log('refreshToken changed', tokens.refreshToken)

    if (tokens?.accessToken) {
      console.log('--session value with tokens value');
      sessionStorage.setItem("accessToken", tokens.accessToken);

    }
    if (tokens?.refreshToken) {
      console.log('--Local value with tokens value');
      localStorage.setItem("refreshToken", tokens.refreshToken);

    }
  }, [tokens])


  useEffect(() => {
    setNavigator(navigate);
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theam', theam)
  }, [theam])


  return (
    <>
      <StateContext.Provider value={{ tokens, setTokens, theam, setTheam }} >
        <ToastContainer position="top-right" autoClose={3500} />

        <Routes>
          <Route path="/" element={
            tokens.accessToken
              ? <Navigate to="/home" />
              : tokens.refreshToken
                ? <Navigate to="/home" />
                : <Navigate to="/login" />
          } />
          <Route path='/login' element={tokens.accessToken ? <Navigate to="/home" /> : <LoginPage />} />
          <Route path='/register' element={tokens.accessToken ? <Navigate to="/home" /> : <RegisterPage />} />
          <Route path='/refresh' element={(!tokens.accessToken && tokens.refreshToken) ? <Refresh /> : <Navigate to='/login' />} />
          <Route path='/home' element={<ProtectedRoutes>{<MainLayout page={<Home />} />}</ProtectedRoutes>} />
          <Route path='/updatepassword' element={<ProtectedRoutes>{<MainLayout page={<UpdatePassword />} />}</ProtectedRoutes>} />
          <Route path='/logout' element={<ProtectedRoutes>{<LogOut />}</ProtectedRoutes>} />
          <Route path='/deleteaccount' element={<ProtectedRoutes>{<DelAc />}</ProtectedRoutes>} />
          <Route path='/getuser' element={<ProtectedRoutes>{<MainLayout page={<AllUsers />} />}</ProtectedRoutes>} />
          <Route path='*' element={<EditUserDetails />} />

        </Routes>
      </StateContext.Provider>

    </>
  )
}

export default App
