import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import PageLoader from './components/PageLoader'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, logout, setLoading } from './app/features/authSlice'

const App = () => {

  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        dispatch(setLoading(true));
        const { data } = await api.get('/api/users/data');
        if (data && data.user) {
          dispatch(login({ token, user: data.user }));
        } else {
          dispatch(login({ token, user: data }));
        }
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout()); 
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Routes>
        <Route path ='/' element={<PageLoader><Home /></PageLoader>} />

        <Route path='app' element = {<Layout />}>
          <Route index element={<PageLoader><Dashboard /></PageLoader>} />
          <Route path='builder/:resumeId' element={<PageLoader><ResumeBuilder /></PageLoader>} />
        </Route>

        <Route path = 'view/:resumeId' element={<PageLoader><Preview /></PageLoader>} />
        <Route path ='login' element={<PageLoader><Login /></PageLoader>} />
      </Routes>
    </>
  )
}

export default App