import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <div className='min-h-screen bg-[#f8fafc] selection:bg-indigo-100 selection:text-indigo-700'>
        <div className='fixed inset-0 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] opacity-[0.03] pointer-events-none'></div>
        <Navbar />
        <main className='relative transition-all duration-300'>
            <Outlet/>
        </main>
    </div>
  )
}

export default Layout