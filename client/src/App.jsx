import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import PageLoader from './components/PageLoader'

const App = () => {
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