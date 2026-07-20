import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'

const Layout = () => {
  const { user, loading } = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-md flex flex-col items-center justify-center z-[9999]">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-green-600 animate-spin"></div>
          <p className="mt-6 text-sm font-bold text-slate-800 uppercase tracking-widest animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null;
  }

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