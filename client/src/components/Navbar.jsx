import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'

const Navbar = () => {
    const user = {name: 'Paritosh Pradhan'}
    const navigate = useNavigate();

    const logoutUser = () => {
        navigate('/')
    }
  return (
    <div className='sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-100'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3 text-slate-800 transition-all'>
            <Link to='/' className='hover:opacity-90 transition-opacity'>
                <img src={logo} alt="logo" className="h-10 w-auto"/>
            </Link>

            <div className='flex items-center gap-6 text-sm font-medium'>
                <p className='max-sm:hidden text-slate-600'>Hi, <span className="text-slate-900 font-semibold">{user?.name}</span></p>
                <button 
                  onClick={logoutUser} 
                  className='bg-slate-900 text-white hover:bg-slate-800 px-6 py-2 rounded-full active:scale-95 transition-all shadow-sm'
                >
                  Logout
                </button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar