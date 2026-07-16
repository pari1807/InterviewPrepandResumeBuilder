import {
  ArrowLeftIcon,
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2,
  Sparkles,
  Trophy,
  User,
  Users,
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import AchievementForm from '../components/AchievementForm'
import ActivityForm from '../components/ActivityForm'
import CertificationForm from '../components/CertificationForm'
import ColorPicker from '../components/ColorPicker'
import EducationForm from '../components/EducationForm'
import ExperienceForm from '../components/ExperienceForm'
import PersonInfo from '../components/PersonInfo'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ProjectForm from '../components/ProjectForm'
import ResumePreview from '../components/ResumePreview'
import SkillForm from '../components/SkillForm'
import TemplateSelector from '../components/TemplateSelector'
import { DEFAULT_LAYOUT_SETTINGS } from '../components/templates/templateUtils'

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

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const storageKey = useMemo(() => (resumeId ? `resume-builder:draft:${resumeId}` : 'resume-builder:draft:new'), [resumeId])

  const [resumeData, setResumeData] = useState(() => buildEmptyResume(resumeId))
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [layoutSettings, setLayoutSettings] = useState(DEFAULT_LAYOUT_SETTINGS)
  const [lastSavedAt, setLastSavedAt] = useState(null)

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Sparkles },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
    { id: 'activities', name: 'Extracurricular', icon: Users },
  ]

  const activeSection = sections[activeSectionIndex] || sections[0]

  const loadResume = () => {
    if (!resumeId) {
      setResumeData(buildEmptyResume())
      return
    }

    const storedDraft = localStorage.getItem(storageKey)
    if (storedDraft) {
      try {
        setResumeData(normalizeResumeData(JSON.parse(storedDraft)))
        return
      } catch {
        localStorage.removeItem(storageKey)
      }
    }

    const resume = dummyResumeData.find((entry) => entry._id === resumeId)
    if (resume) {
      setResumeData(normalizeResumeData(resume))
      document.title = `Resume Builder - ${resume.title}`
    } else {
      setResumeData(buildEmptyResume(resumeId))
    }
  }

  useEffect(() => {
    loadResume()
    setActiveSectionIndex(0)
  }, [resumeId, storageKey])

  useEffect(() => {
    if (!resumeId) return
    localStorage.setItem(storageKey, JSON.stringify(resumeData))
  }, [resumeId, resumeData, storageKey])

  const changeResumeVisibility = () => {
    setResumeData((prev) => ({ ...prev, public: !prev.public }))
  }

  const handleShare = async () => {
    const resumeUrl = `${window.location.origin}/view/${resumeId || 'preview'}`

    if (navigator.share) {
      await navigator.share({ url: resumeUrl, text: 'My Resume' })
      return
    }

    await navigator.clipboard.writeText(resumeUrl)
    alert('Resume link copied to clipboard.')
  }

  const downloadResume = () => {
    window.print()
  }

  const saveResume = () => {
    if (!resumeId) return
    localStorage.setItem(storageKey, JSON.stringify(resumeData))
    setLastSavedAt(new Date())
  }

  const renderActiveSection = () => {
    switch (activeSection.id) {
      case 'personal':
        return <PersonInfo data={resumeData.personal_info} onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
      case 'summary':
        return <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))} />
      case 'experience':
        return <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))} />
      case 'projects':
        return <ProjectForm data={resumeData.project} onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))} />
      case 'education':
        return <EducationForm data={resumeData.education} onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))} />
      case 'skills':
        return <SkillForm data={resumeData.skills} onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))} />
      case 'certifications':
        return <CertificationForm data={resumeData.certifications} onChange={(data) => setResumeData((prev) => ({ ...prev, certifications: data }))} />
      case 'achievements':
        return <AchievementForm data={resumeData.achievements} onChange={(data) => setResumeData((prev) => ({ ...prev, achievements: data }))} />
      case 'activities':
        return <ActivityForm data={resumeData.extracurricular_activities} onChange={(data) => setResumeData((prev) => ({ ...prev, extracurricular_activities: data }))} />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f7fbf8_0%,#eef7f1_100%)]'>
      <div className='mx-auto max-w-7xl px-4 pt-6'>
        <Link to={'/app'} className='inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-all hover:text-emerald-800'>
          <ArrowLeftIcon className='size-4' /> Back to Dashboard
        </Link>
      </div>

      <div className='mx-auto max-w-7xl px-4 pb-8 pt-5'>
        <div className='grid items-start gap-8 lg:grid-cols-12'>
          <div className='relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-[0_24px_80px_rgba(16,185,129,0.08)] backdrop-blur lg:col-span-5'>
            <div className='absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 to-emerald-600' style={{ width: `${(activeSectionIndex * 100) / (sections.length - 1)}%` }} />

            <div className='space-y-6 p-6'>
              <div className='flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4'>
                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData((prev) => ({ ...prev, template }))} />
                  <ColorPicker selectedColor={resumeData.accentColor} onChange={(color) => setResumeData((prev) => ({ ...prev, accentColor: color }))} />
                </div>
                <div className='flex items-center gap-2'>
                  {activeSectionIndex > 0 && (
                    <button type='button' onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-emerald-50 hover:text-emerald-700'>
                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )}
                  <button type='button' onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-all ${activeSectionIndex === sections.length - 1 ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`} disabled={activeSectionIndex === sections.length - 1}>
                    <ChevronRight className='size-4' /> Next
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                {sections.map((section, index) => {
                  const SectionIcon = section.icon
                  const isActive = index === activeSectionIndex

                  return (
                    <button
                      key={section.id}
                      type='button'
                      onClick={() => setActiveSectionIndex(index)}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-left text-xs font-medium transition-all ${isActive ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50'}`}
                    >
                      <SectionIcon className='size-4 shrink-0' />
                      <span className='leading-tight'>{section.name}</span>
                    </button>
                  )
                })}
              </div>

              <div className='grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-sm font-semibold text-slate-900'>Compact Layout Controls</p>
                    <p className='text-xs text-slate-500'>Tune typography and spacing to match a single-page CV.</p>
                  </div>
                  <select
                    value={layoutSettings.layoutMode}
                    onChange={(event) => {
                      const layoutMode = event.target.value
                      setLayoutSettings((prev) => ({
                        ...prev,
                        layoutMode,
                        pageMargin: layoutMode === 'compact' ? 0.36 : 0.55,
                        lineSpacing: layoutMode === 'compact' ? 1.22 : 1.3,
                        sectionSpacing: layoutMode === 'compact' ? 0.9 : 1.02,
                      }))
                    }}
                    className='rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none'
                  >
                    <option value='compact'>A4 Compact</option>
                    <option value='normal'>A4 Normal</option>
                  </select>
                </div>

                <div className='grid gap-3 md:grid-cols-2'>
                  <label className='space-y-1 text-xs font-medium text-slate-600'>
                    <span>Font Size</span>
                    <input type='range' min='0.9' max='1.08' step='0.01' value={layoutSettings.fontScale} onChange={(event) => setLayoutSettings((prev) => ({ ...prev, fontScale: Number(event.target.value) }))} className='w-full accent-emerald-600' />
                  </label>
                  <label className='space-y-1 text-xs font-medium text-slate-600'>
                    <span>Heading Size</span>
                    <input type='range' min='0.88' max='1.08' step='0.01' value={layoutSettings.headingScale} onChange={(event) => setLayoutSettings((prev) => ({ ...prev, headingScale: Number(event.target.value) }))} className='w-full accent-emerald-600' />
                  </label>
                  <label className='space-y-1 text-xs font-medium text-slate-600'>
                    <span>Line Spacing</span>
                    <input type='range' min='1.12' max='1.42' step='0.01' value={layoutSettings.lineSpacing} onChange={(event) => setLayoutSettings((prev) => ({ ...prev, lineSpacing: Number(event.target.value) }))} className='w-full accent-emerald-600' />
                  </label>
                  <label className='space-y-1 text-xs font-medium text-slate-600'>
                    <span>Section Spacing</span>
                    <input type='range' min='0.82' max='1.25' step='0.01' value={layoutSettings.sectionSpacing} onChange={(event) => setLayoutSettings((prev) => ({ ...prev, sectionSpacing: Number(event.target.value) }))} className='w-full accent-emerald-600' />
                  </label>
                  <label className='space-y-1 text-xs font-medium text-slate-600 md:col-span-2'>
                    <span>Page Margins</span>
                    <input type='range' min='0.25' max='0.7' step='0.01' value={layoutSettings.pageMargin} onChange={(event) => setLayoutSettings((prev) => ({ ...prev, pageMargin: Number(event.target.value) }))} className='w-full accent-emerald-600' />
                  </label>
                </div>
              </div>

              <div className='space-y-6'>
                {renderActiveSection()}
              </div>

              <div className='flex flex-wrap items-center gap-3 border-t border-emerald-100 pt-4'>
                <button type='button' onClick={saveResume} className='inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700'>
                  Save Changes
                </button>
                {lastSavedAt && <span className='text-xs text-slate-500'>Saved {lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
            </div>
          </div>

          <div className='max-lg:mt-6 lg:col-span-7'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs text-blue-700 shadow-sm ring-1 ring-blue-200 transition-colors hover:bg-blue-50 hover:ring-blue-300'>
                    <Share2 className='size-4' /> Share
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:ring-slate-300'>
                  {resumeData.public ? <Eye className='size-4' /> : <EyeOff className='size-4' />}
                  {resumeData.public ? <span>Public</span> : <span>Private</span>}
                </button>
                <button onClick={downloadResume} className='flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition-colors hover:bg-emerald-50 hover:ring-emerald-300'>
                  <Download className='size-4' /> PDF
                </button>
              </div>
            </div>

            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accentColor} settings={layoutSettings} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
