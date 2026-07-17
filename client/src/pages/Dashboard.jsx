import React from 'react'
import { FilePenIcon, PlusIcon, UploadCloudIcon, TrashIcon, PencilIcon, XIcon  } from 'lucide-react'
import { useState, useEffect } from 'react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

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
  const [title, setTitle] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [editResumeId, setEditResumeId] = useState("")
  const [showEditTitle, setShowEditTitle] = useState(false)

  const navigate = useNavigate();

  const loadAllResumes = () => {
    // Start with all dummy resumes mapped by ID
    const resumesMap = {}
    dummyResumeData.forEach(resume => {
      resumesMap[resume._id] = { ...resume }
    })

    // Scan localStorage for drafts
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('resume-builder:draft:')) {
        const id = key.substring('resume-builder:draft:'.length)
        try {
          const stored = JSON.parse(localStorage.getItem(key))
          if (stored) {
            resumesMap[id] = {
              ...resumesMap[id],
              ...stored,
              _id: id,
              updatedAt: stored.updatedAt || new Date().toISOString(),
              createdAt: stored.createdAt || new Date().toISOString(),
            }
          }
        } catch (e) {
          console.error("Error parsing stored resume", e)
        }
      }
    }

    // Convert map to array and sort by updatedAt desc
    const mergedList = Object.values(resumesMap).sort((a, b) => {
      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
    })

    setAllResumes(mergedList)
  }

  const deleteResume = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resume? This action cannot be undone.");
    if(confirmDelete) {
      localStorage.removeItem(`resume-builder:draft:${id}`)
      setAllResumes(prev => prev.filter(resume => resume._id !== id))
    }
  }

  const updateResumeTitle = (e) => {
    e.preventDefault()
    const resumeToEdit = allResumes.find(r => r._id === editResumeId)
    if (resumeToEdit) {
      const updatedResume = {
        ...resumeToEdit,
        title: title,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(`resume-builder:draft:${editResumeId}`, JSON.stringify(updatedResume))
      setAllResumes(prev => prev.map(resume => 
        resume._id === editResumeId ? updatedResume : resume
      ))
    }
    setShowEditTitle(false)
    setEditResumeId("")
    setTitle("")
  }

  const handleEditClick = (e, resume) => {
    e.stopPropagation()
    setEditResumeId(resume._id)
    setTitle(resume.title)
    setShowEditTitle(true)
  }

  const createResume = async(event)=>{
    event.preventDefault();
    setShowCreateResume(false);
    
    const newId = 'resume-' + Math.random().toString(36).substring(2, 11)
    const newResume = {
      _id: newId,
      title: title || "Untitled Resume",
      personal_info: {},
      professional_summary: '',
      experience: [],
      project: [],
      education: [],
      skills: [],
      certifications: [],
      achievements: [],
      extracurricular_activities: [],
      template: 'classic',
      accentColor: '#10b981',
      public: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`resume-builder:draft:${newId}`, JSON.stringify(newResume))
    setTitle("")
    navigate(`/app/builder/${newId}`)
  }

  const uploadResume = async(event)=>{
    event.preventDefault();
    setShowUploadResume(false);
    
    const newId = 'resume-' + Math.random().toString(36).substring(2, 11)
    const newResume = {
      _id: newId,
      title: title || (resumeFile ? resumeFile.name.replace(/\.pdf$/i, '') : "Imported Resume"),
      personal_info: {},
      professional_summary: '',
      experience: [],
      project: [],
      education: [],
      skills: [],
      certifications: [],
      achievements: [],
      extracurricular_activities: [],
      template: 'classic',
      accentColor: '#10b981',
      public: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(`resume-builder:draft:${newId}`, JSON.stringify(newResume))
    setTitle("")
    setResumeFile(null)
    navigate(`/app/builder/${newId}`)
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
                <button onClick = {()=> setShowCreateResume(true)} className='flex flex-col items-center justify-center p-8 bg-white border border-slate-200 shadow-sm rounded-3xl gap-4 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500 group cursor-pointer'>
                  <div className='p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:rotate-12'>
                    <PlusIcon className='size-8' />
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors'>Create New</p>
                    <p className='text-sm text-slate-400 mt-1'>Start with a fresh template</p>
                  </div>
                </button>

                <button  onClick={()=>setShowUploadResume(true)} className='flex flex-col items-center justify-center p-8 bg-white border border-slate-200 shadow-sm rounded-3xl gap-4 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-50 transition-all duration-500 group cursor-pointer'>
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
                <div className='h-0.5 flex-1 bg-linear-to-r from-slate-200 to-transparent'></div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8'>
                {allResumes.map((resume, index) => {
                   const color = colors[index % colors.length];
                   return(
                    <div 
                      key={index} 
                      onClick={() => navigate(`/app/builder/${resume._id}`)}
                      className={`group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl ${color.shadow} transition-all duration-500 hover:-translate-y-2 cursor-pointer`}
                    >
                      <div className={`h-40 ${color.bg} flex items-center justify-center relative overflow-hidden`}>
                        <div className={`absolute inset-0 opacity-10 bg-linear-to-br from-white to-transparent`}></div>
                        <FilePenIcon className={`size-16 ${color.text} opacity-30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`} />
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-20">
                           <button 
                             onClick={(e) => { e.stopPropagation(); deleteResume(resume._id); }}
                             className='p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all scale-90 hover:scale-100'
                           >
                             <TrashIcon className='size-4' />
                           </button>
                           <button 
                             onClick={(e) => handleEditClick(e, resume)}
                             className='p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all scale-90 hover:scale-100'
                           >
                             <PencilIcon className='size-4' />
                           </button>
                        </div>
                      </div>

                      <div className='p-6 bg-white'>
                        <h3 className='font-bold text-slate-800 text-lg truncate mb-1' title={resume.title}>{resume.title}</h3>
                        <div className='flex items-center gap-2'>
                           <div className={`size-1.5 rounded-full ${color.icon}`}></div>
                           <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                             Updated {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                           </p>
                        </div>
                      </div>

                      <div className={`h-1.5 w-0 group-hover:w-full transition-all duration-700 bg-linear-to-r from-transparent via-indigo-500 to-transparent absolute bottom-0`}></div>
                    </div>
                   )
                })}
            </div>

            {showCreateResume && (
              <div onClick={()=>setShowCreateResume(false)} className='fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'>
                <form 
                  onClick={e=>e.stopPropagation()} 
                  onSubmit={createResume}
                  className='bg-white rounded-4xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100'
                >
                  <div className='bg-indigo-600 p-8 text-white relative overflow-hidden'>
                     <div className='absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl'></div>
                     <h2 className='text-3xl font-bold relative z-10'>New Resume</h2>
                     <p className='text-indigo-100 mt-2 relative z-10'>Give your professional journey a title.</p>
                  </div>
                  
                  <div className='p-8'>
                    <div className='mb-6'>
                      <label className='block text-sm font-semibold text-slate-500 mb-2'>Resume Title</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)} 
                        placeholder='e.g. Your Name - Designation' 
                        className='w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium' 
                        required
                      />
                    </div>

                    <div className='flex gap-3'>
                      <button 
                        type="button"
                        onClick={() => setShowCreateResume(false)}
                        className='flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all'
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className='flex-1 py-4 px-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95'
                      >
                        Create
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => { setShowCreateResume(false); setTitle("") }}
                    className='absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors'
                  >
                    <XIcon className='size-5' />
                  </button>
                </form>
              </div>
            )}

            {showUploadResume && (
              <div onClick={()=>setShowUploadResume(false)} className='fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300'>
                <form 
                  onClick={e=>e.stopPropagation()} 
                  onSubmit={uploadResume}
                  className='bg-white rounded-4xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100'
                >
                  <div className='bg-purple-600 p-8 text-white relative overflow-hidden'>
                     <div className='absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl'></div>
                     <h2 className='text-3xl font-bold relative z-10'>Import PDF</h2>
                     <p className='text-purple-100 mt-2 relative z-10'>We'll parse your resume automatically.</p>
                  </div>
                  
                  <div className='p-8'>
                    <div className='mb-6'>
                      <label className='block text-sm font-semibold text-slate-500 mb-2'>Resume Title</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)} 
                        placeholder='e.g. My Existing Resume' 
                        className='w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all placeholder:text-slate-300 font-medium' 
                        required
                      />
                    </div>

                    <div className='mb-8'>
                      <label htmlFor="resume-input" className='cursor-pointer group'>
                        <div className='flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50/50 group-hover:border-purple-500 group-hover:bg-purple-50 transition-all duration-300'>
                          {resumeFile ? (
                            <div className='flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-purple-100 animate-in zoom-in-95'>
                              <div className='p-2 bg-purple-100 text-purple-600 rounded-lg'>
                                <FilePenIcon className='size-5' />
                              </div>
                              <p className='text-sm font-bold text-slate-700 truncate max-w-50'>{resumeFile.name}</p>
                            </div>
                          ) : (
                            <>
                              <div className='p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform'>
                                <UploadCloudIcon className='size-8 text-purple-500' />
                              </div>
                              <div className='text-center'>
                                <p className='text-sm font-bold text-slate-700'>Drop your PDF here</p>
                                <p className='text-xs text-slate-400 mt-1'>or click to browse files</p>
                              </div>
                            </>
                          )}
                        </div>
                      </label>
                      <input type="file" id='resume-input' accept='.pdf' onChange={(e)=>setResumeFile(e.target.files[0])} className='hidden' required/>
                    </div>

                    <div className='flex gap-3'>
                      <button 
                        type="button"
                        onClick={() => setShowUploadResume(false)}
                        className='flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all'
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className='flex-1 py-4 px-6 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95'
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => { setShowUploadResume(false); setTitle("") }}
                    className='absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors'
                  >
                    <XIcon className='size-5' />
                  </button>
                </form>
              </div>
            )}

            
{showEditTitle && (
  <div
    onClick={() => setShowEditTitle(false)}
    className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
  >
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={updateResumeTitle}
      className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100"
    >
      <div className="bg-amber-500 p-8 text-white relative overflow-hidden">
        <h2 className="text-3xl font-bold">Edit Resume</h2>
        <p className="text-amber-100 mt-2">
          Update your resume title.
        </p>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-500 mb-2">
            Resume Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resume Title"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setShowEditTitle(false);
              setEditResumeId("");
            }}
            className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 py-4 px-6 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600"
          >
            Update
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setShowEditTitle(false);
          setEditResumeId("");
          setTitle("");
        }}
        className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl"
      >
        <XIcon className="size-5" />
      </button>
    </form>
  </div>
)}

        </div>
    </div>
  )
}

export default Dashboard;