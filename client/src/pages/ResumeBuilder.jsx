import { ArrowLeftIcon, FileText, User, Briefcase, FolderIcon, GraduationCap, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import {dummyResumeData} from '../assets/assets';
import PersonInfo from '../components/PersonInfo';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import { DEFAULT_LAYOUT_SETTINGS } from '../components/templates/templateUtils';
import ColorPicker from '../components/ColorPicker';

const ResumeBuilder = () => {
  const {resumeId} = useParams();
  const[resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    skills: [],
    template: "classic",
    accentColor: "#10b981",
    public: false,
  }); 
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [layoutSettings, setLayoutSettings] = useState(DEFAULT_LAYOUT_SETTINGS);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id : "summary", name: "Summary", icon: FileText },
    { id : "experience", name: "Experience", icon: Briefcase },
    { id : "projects", name: "Projects", icon: FolderIcon },
    { id : "education", name: "Education", icon: GraduationCap },
    { id : "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
        const resume = dummyResumeData.find((resume) => resume._id === resumeId);
        if(resume){
          setResumeData({
            ...resume,
            personal_info: resume.personal_info || {},
            professional_summary: resume.professional_summary || '',
            experience: resume.experience || [],
            education: resume.education || [],
            skills: resume.skills || [],
            template: resume.template || 'classic',
            accentColor: resume.accentColor || resume.accent_color || '#10b981',
            public: Boolean(resume.public),
          });
          document.title = `Resume Builder - ${resume.title}`;
        } else {
          setResumeData({
            _id: '',
            title: '',
            personal_info: {},
            professional_summary: '',
            experience: [],
            education: [],
            skills: [],
            template: 'classic',
            accentColor: '#10b981',
            public: false,
          });
        }
  }

  useEffect(() => {
    loadExistingResume();
  },[resumeId]);

  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f8fdfb_0%,#eef8f2_100%)]'>
      <div className='max-w-7xl mx-auto px-4 pt-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-all'>
          <ArrowLeftIcon className = "size-4"/> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8 pt-5'>
        <div className='grid lg:grid-cols-12 gap-8 items-start'>
          {/* Left Side - Form */}
          <div className='relative lg:col-span-5 rounded-3xl overflow-hidden bg-white/90 backdrop-blur border border-emerald-100 shadow-[0_24px_80px_rgba(16,185,129,0.08)]'>
            <div className='p-6 pt-1'>
              {/* progress bar using activesectionindex */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-emerald-100'/>
              <hr className='absolute top-0 left-0 h-1 bg-linear-to-r from-emerald-500 to-emerald-600 border-none transition-all duration-500' style={{width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`}}/>


              {/* Section Navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-emerald-100 py-3'>
                <div className ='flex items-center gap-2'> 
                  <TemplateSelector selectedTemplate = {resumeData.template} onChange = {(template) => setResumeData(prev => ({...prev, template}))}/>
                  <ColorPicker selectedColor={resumeData.accentColor} onChange = {(color) => setResumeData(prev => ({...prev, accentColor: color}))} />
                </div>
                <div className='flex items-center gap-2'>
                  {activeSectionIndex != 0 && (
                    <button type="button" onClick = {() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all' disabled = {activeSectionIndex === 0} >
                      <ChevronLeft className ="size-4" /> Previous
                    </button>
                  )}
                  <button type="button" onClick = {() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSectionIndex === sections.length - 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`} disabled = {activeSectionIndex === sections.length - 1} >
                      <ChevronRight className ="size-4" /> Next
                    </button>
                </div>
              </div>

              <div className="mb-6 grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Compact Layout Controls</p>
                    <p className="text-xs text-slate-500">Tune typography and spacing to match the reference CV.</p>
                  </div>
                  <select
                    value={layoutSettings.layoutMode}
                    onChange={(e) => {
                      const layoutMode = e.target.value;
                      setLayoutSettings((prev) => ({
                        ...prev,
                        layoutMode,
                        pageMargin: layoutMode === 'compact' ? 0.38 : 0.62,
                        lineSpacing: layoutMode === 'compact' ? 1.26 : 1.34,
                        sectionSpacing: layoutMode === 'compact' ? 0.92 : 1.05,
                      }));
                    }}
                    className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                  >
                    <option value="compact">A4 Compact</option>
                    <option value="normal">A4 Normal</option>
                  </select>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-1 text-xs font-medium text-slate-600">
                    <span>Font Size</span>
                    <input type="range" min="0.9" max="1.1" step="0.01" value={layoutSettings.fontScale} onChange={(e) => setLayoutSettings((prev) => ({ ...prev, fontScale: Number(e.target.value) }))} className="w-full accent-emerald-600" />
                  </label>
                  <label className="space-y-1 text-xs font-medium text-slate-600">
                    <span>Heading Size</span>
                    <input type="range" min="0.9" max="1.15" step="0.01" value={layoutSettings.headingScale} onChange={(e) => setLayoutSettings((prev) => ({ ...prev, headingScale: Number(e.target.value) }))} className="w-full accent-emerald-600" />
                  </label>
                  <label className="space-y-1 text-xs font-medium text-slate-600">
                    <span>Line Spacing</span>
                    <input type="range" min="1.15" max="1.5" step="0.01" value={layoutSettings.lineSpacing} onChange={(e) => setLayoutSettings((prev) => ({ ...prev, lineSpacing: Number(e.target.value) }))} className="w-full accent-emerald-600" />
                  </label>
                  <label className="space-y-1 text-xs font-medium text-slate-600">
                    <span>Section Spacing</span>
                    <input type="range" min="0.85" max="1.35" step="0.01" value={layoutSettings.sectionSpacing} onChange={(e) => setLayoutSettings((prev) => ({ ...prev, sectionSpacing: Number(e.target.value) }))} className="w-full accent-emerald-600" />
                  </label>
                  <label className="space-y-1 text-xs font-medium text-slate-600 md:col-span-2">
                    <span>Page Margins</span>
                    <input type="range" min="0.25" max="0.75" step="0.01" value={layoutSettings.pageMargin} onChange={(e) => setLayoutSettings((prev) => ({ ...prev, pageMargin: Number(e.target.value) }))} className="w-full accent-emerald-600" />
                  </label>
                </div>
              </div>

              {/* Form Content */}
              <div className = 'space-y-6'>
                  {activeSection.id === 'personal' && (
                    <PersonInfo data={resumeData.personal_info} onChange = {(data) => setResumeData(prev => ({...prev, personal_info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                  )}
              </div>
            </div>
          </div>

          {/* Right Side - Resume Preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div>
              {/*----------buttons--------*/}
            </div>

            {/*---------Resume Preview---------*/}
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accentColor} settings={layoutSettings}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder