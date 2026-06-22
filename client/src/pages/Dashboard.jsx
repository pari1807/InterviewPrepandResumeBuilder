import React from 'react'
import { FilePenIcon, PlusIcon, UploadCloudIcon, TrashIcon, PencilIcon  } from 'lucide-react'
import { useState, useEffect } from 'react'
import { dummyResumeData } from '../assets/assets'

const Dashboard = () => {
  const colors = [
    { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: "bg-amber-500", shadow: "hover:shadow-amber-100" },
    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: "bg-emerald-500", shadow: "hover:shadow-emerald-100" },
    { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: "bg-blue-500", shadow: "hover:shadow-blue-100" },
    { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", icon: "bg-pink-500", shadow: "hover:shadow-pink-100" },
    { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", icon: "bg-rose-500", shadow: "hover:shadow-rose-100" },
    { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", icon: "bg-purple-500", shadow: "hover:shadow-purple-100" }
  ]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)


  const loadAllResumes = () => {
    setAllResumes(dummyResumeData)
  }

  useEffect(() => {
    loadAllResumes()
  },[])

  return (
    <div className='min-h-[calc(100vh-64px)] bg-slate-50/30'>
        <div className='max-w-7xl mx-auto px-6 py-10'>
            <header className='mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4'>
                <div>
                  <h1 className='text-4xl font-extrabold text-slate-900 tracking-tight'>Welcome back, <span className="text-indigo-600">Paritosh</span></h1>
                  <p className='text-slate-500 mt-2 text-lg'>Ready to build your next career-defining resume?</p>
                </div>
            </header>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
                <button className='flex flex-col items-center justify-center p-8 bg-white border border-slate-200 shadow-sm rounded-3xl gap-4 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500 group cursor-pointer'>
                  <div className='p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:rotate-12'>
                    <PlusIcon className='size-8' />
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors'>Create New</p>
                    <p className='text-sm text-slate-400 mt-1'>Start with a fresh template</p>
                  </div>
                </button>

                <button className='flex flex-col items-center justify-center p-8 bg-white border border-slate-200 shadow-sm rounded-3xl gap-4 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-50 transition-all duration-500 group cursor-pointer'>
                  <div className='p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 group-hover:-rotate-12'>
                    <UploadCloudIcon className='size-8' />
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors'>Quick Import</p>
                    <p className='text-sm text-slate-400 mt-1'>Upload your existing PDF</p>
                  </div>
                </button>
            </div>

            <div className='flex items-center gap-4 mb-8'>
                <h2 className='text-2xl font-bold text-slate-800 whitespace-nowrap'>Your Collection</h2>
                <div className='h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent'></div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8'>
                {allResumes.map((resume, index) => {
                   const color = colors[index % colors.length];
                   return(
                    <div key={index} className={`group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl ${color.shadow} transition-all duration-500 hover:-translate-y-1`}>
                      <div className={`h-40 ${color.bg} flex items-center justify-center relative overflow-hidden`}>
                        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent`}></div>
                        <FilePenIcon className={`size-16 ${color.text} opacity-40 group-hover:scale-110 transition-transform duration-500`} />
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                           <button className='p-2.5 bg-white shadow-lg rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-50 transition-all'>
                             <TrashIcon className='size-4' />
                           </button>
                           <button className='p-2.5 bg-white shadow-lg rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all'>
                             <PencilIcon className='size-4' />
                           </button>
                        </div>
                      </div>

                      <div className='p-6'>
                        <h3 className='font-bold text-slate-800 text-lg truncate mb-1' title={resume.title}>{resume.title}</h3>
                        <div className='flex items-center gap-2'>
                           <div className={`size-2 rounded-full ${color.icon}`}></div>
                           <p className='text-xs font-semibold text-slate-400 uppercase tracking-widest'>
                             {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                           </p>
                        </div>
                      </div>

                      <div className={`h-1.5 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-transparent via-indigo-500 to-transparent absolute bottom-0`}></div>
                    </div>
                   )
                })}
            </div>

            {
              
            }
        </div>
    </div>
  )
}

export default Dashboard;