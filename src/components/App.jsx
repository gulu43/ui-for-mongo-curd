import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoutes.jsx'
import { LogOut } from './LogOut.jsx'
import { InvalidRouts } from './InvalidRouts.jsx'
import { Login } from './Login.jsx'
import { Register } from './Register.jsx'
import { Refresh } from './Refresh.jsx'
import { Home } from './Home.jsx'
import { createContext } from 'react'
import '../App.css'
import { UpdatePassword } from './UpdatePassword.jsx'
import { DelAc } from './DelAc.jsx'
import { setAccessTokenOutside, setNavigator } from "./redirect.js";
import axiosInstance from './axiosIntercepter.js'

export const StateContext = createContext()

function App() {
  
  useEffect(() => {
    const check = localStorage.getItem('refreshToken')
    if (check) {
      axiosInstance.get('/me')
    }
  }, [])

  const navigate = useNavigate();

  const [theam, setTheam] = useState('dark')

  const [tokens, setTokens] = useState({
    accessToken: sessionStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  })

  useEffect(() => {
    setAccessTokenOutside((accessToken) => {
      console.log('inside setter: ',accessToken);
      
      setTokens((prev) => ({
        ...prev,
        'accessToken': accessToken
      }))
    })
  }, [])

  useEffect(() => {
    console.log('accessToken changed', tokens.accessToken)
    console.log('refreshToken changed', tokens.refreshToken)
  }, [tokens])
  

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate])

  useEffect(() => {
    document.documentElement.setAttribute('data-theam', theam)
  }, [theam])


  return (
    <>
      <StateContext.Provider value={{ tokens, setTokens, theam, setTheam }} >
        <Routes>
          <Route path="/" element={
            tokens.accessToken
              ? <Navigate to="/home" />
              : tokens.refreshToken
                ? <Navigate to="/home" />
                : <Navigate to="/login" />
          } />
          <Route path='/login' element={tokens.accessToken ? <Navigate to="/home" /> : <Login />} />
          <Route path='/register' element={tokens.accessToken ? <Navigate to="/home" /> : <Register />} />
          <Route path='/refresh' element={(!tokens.accessToken && tokens.refreshToken) ? <Refresh /> : <Navigate to='/login' />} />
          <Route path='/home' element={<ProtectedRoutes>{<Home />}</ProtectedRoutes>} />
          <Route path='/updatepassword' element={<ProtectedRoutes>{<UpdatePassword />}</ProtectedRoutes>} />
          <Route path='/logout' element={<ProtectedRoutes>{<LogOut />}</ProtectedRoutes>} />
          <Route path='/deleteaccount' element={<ProtectedRoutes>{<DelAc />}</ProtectedRoutes>} />
          <Route path='*' element={<InvalidRouts />} />

        </Routes>
      </StateContext.Provider>

    </>
  )
}

export default App
