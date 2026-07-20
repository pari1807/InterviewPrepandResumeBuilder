// =====================================================
// AI-CHANGE
// Date: 2026-07-20
// Reason: Integrate backend MongoDB resume data recovery (public/private) for previewing.
// Changes: Imported api. Implemented async fetch in useEffect checking database endpoints before falling back to localStorage/dummy entries.
// Connected Files: client/src/configs/api.js, server/controllers/resumeController.js
// =====================================================
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/ResumePreview'
import { DEFAULT_LAYOUT_SETTINGS } from '../components/templates/templateUtils'
import { ArrowLeft, Printer } from 'lucide-react'
import api from '../configs/api'

const buildEmptyResume = (resumeId = '') => ({
  _id: resumeId,
  title: '',
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
})

const normalizeResumeData = (resume = {}) => ({
  ...buildEmptyResume(resume._id || ''),
  ...resume,
  personal_info: resume.personal_info || {},
  professional_summary: resume.professional_summary || '',
  experience: resume.experience || [],
  project: resume.project || resume.projects || [],
  education: resume.education || [],
  skills: resume.skills || [],
  certifications: resume.certifications || resume.certificates || [],
  achievements: resume.achievements || [],
  extracurricular_activities: resume.extracurricular_activities || resume.extracurricularActivities || resume.activities || [],
  template: resume.template || 'classic',
  accentColor: resume.accentColor || resume.accent_color || '#10b981',
  public: Boolean(resume.public),
})

const Preview = () => {
  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        // 1. Try to load from the authenticated route (works if user is owner)
        try {
          const { data } = await api.get(`/api/resumes/${resumeId}`);
          if (data && data.resume) {
            setResumeData(normalizeResumeData(data.resume));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log("Could not load private resume, trying public endpoint...");
        }

        // 2. Try to load from the public route (no auth needed)
        try {
          const { data } = await api.get(`/api/resumes/public/${resumeId}`);
          if (data && data.resume) {
            setResumeData(normalizeResumeData(data.resume));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log("Could not load public resume from backend.");
        }
      } catch (err) {
        console.error("Backend fetch error:", err);
      }

      // 3. Fallback: local storage
      const storageKey = `resume-builder:draft:${resumeId}`
      const storedDraft = localStorage.getItem(storageKey)
      
      if (storedDraft) {
        try {
          setResumeData(normalizeResumeData(JSON.parse(storedDraft)))
          setLoading(false)
          return
        } catch {
          localStorage.removeItem(storageKey)
        }
      }

      // 4. Fallback: dummy data
      const resume = dummyResumeData.find((entry) => entry._id === resumeId)
      if (resume) {
        setResumeData(normalizeResumeData(resume))
      } else {
        setResumeData(normalizeResumeData({ _id: resumeId }))
      }
      setLoading(false)
    };

    fetchResume();
  }, [resumeId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!resumeData || (!resumeData.personal_info?.full_name && !resumeData.title)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Resume Not Found</h2>
          <p className="text-slate-500 mb-6">The resume you are trying to view does not exist or has been deleted.</p>
          <Link to="/app" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700">
            <ArrowLeft className="size-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100/50 py-6 print:py-0">
      {/* Top action bar, hidden in print */}
      <div className="max-w-4xl mx-auto px-4 mb-6 flex items-center justify-between print:hidden">
        <Link to="/app" className="inline-flex items-center gap-2 text-sm font-medium text-slate-650 transition-all hover:text-emerald-750">
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700 shadow-sm shadow-emerald-100 active:scale-95"
        >
          <Printer className="size-4" /> Print / PDF
        </button>
      </div>

      {/* Resume Container */}
      <div className="max-w-4xl mx-auto px-4 print:px-0">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accentColor}
          settings={DEFAULT_LAYOUT_SETTINGS}
        />
      </div>
    </div>
  )
}

export default Preview