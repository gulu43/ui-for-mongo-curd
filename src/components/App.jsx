import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoutes.jsx'
import { LogOut } from '../../LogOut.jsx'
import { InvalidRouts } from './InvalidRouts.jsx'
import { Login } from './Login.jsx'
import { Register } from './Register.jsx'
import { Home } from './Home.jsx'
import { createContext } from 'react'
import '../App.css'

export const StateContext = createContext()

function App() {
  const [theam, setTheam] = useState('Dark')
  const [tokens, setTokens] = useState({
    accessToken: '',
    refreshToken: ''
  })

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    setTokens({
      accessToken: accessToken,
      refreshToken: refreshToken
    })
    console.log(`accessToken: ${tokens.accessToken},\n refreshToken: ${tokens.refreshToken}`);

  }, [])


  return (
    <>
      <StateContext.Provider value={{ tokens, setTokens, theam, setTheam }} >
        <Routes>
          <Route path="/" element={
            tokens.accessToken ? <Navigate to="/home" /> : <Navigate to="/login" />
          } />
          <Route path='/login' element={tokens.accessToken ? <Navigate to="/home" /> : <Login />} />
          <Route path='/register' element={tokens.accessToken ? <Navigate to="/home" /> : <Register />} />
          <Route path='/home' element={<ProtectedRoutes>{<Home />}</ProtectedRoutes>} />
          <Route path='/logout' element={<ProtectedRoutes>{<LogOut />}</ProtectedRoutes>} />
          <Route path='*' element={<InvalidRouts />} />

        </Routes>
      </StateContext.Provider>

    </>
  )
}

export default App
