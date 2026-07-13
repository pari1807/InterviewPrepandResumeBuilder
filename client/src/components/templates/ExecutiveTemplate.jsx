import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import React from 'react'
import { formatDate, toBulletList } from './templateUtils'

const ExecutiveTemplate = ({ data, accentColor = '#10b981' }) => {
    const personalInfo = data?.personal_info || {}
    const experience = data?.experience || []
    const education = data?.education || []
    const skills = data?.skills || []
    const projects = data?.project || []
    const certificates = data?.certificates || data?.certifications || []
    const achievements = data?.achievements || []
    const extracurricular = data?.extracurricular_activities || data?.extracurricularActivities || data?.activities || []

    return (
        <div className="mx-auto max-w-4xl bg-white text-slate-800">
            <header className="border-b border-slate-100 bg-slate-950 px-8 py-8 text-white" style={{ backgroundColor: accentColor }}>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Executive Profile</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">{personalInfo.full_name || 'Your Name'}</h1>
                <p className="mt-2 text-lg text-white/90">{personalInfo.profession || 'Professional Title'}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/90">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
            </header>

            <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
                <main className="space-y-8 px-8 py-8">
                    {data.professional_summary && (
                        <section>
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Executive Summary</h2>
                            <p className="leading-relaxed text-slate-700">{data.professional_summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Leadership Experience</h2>
                            <div className="space-y-6">
                                {experience.map((exp, index) => (
                                    <div key={index} className="border-l-2 border-slate-200 pl-4">
                                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">{exp.position}</h3>
                                                <p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                            </p>
                                        </div>
                                        {exp.description && (
                                            <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-slate-700">
                                                {toBulletList(exp.description).map((line, lineIndex) => (
                                                    <li key={lineIndex}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Strategic Projects</h2>
                            <div className="space-y-4">
                                {projects.map((project, index) => (
                                    <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <h3 className="font-semibold text-slate-900">{project.name}</h3>
                                        {project.type && <p className="mt-1 text-sm font-medium text-slate-500">{project.type}</p>}
                                        {project.description && (
                                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                                                {toBulletList(project.description).map((line, lineIndex) => (
                                                    <li key={lineIndex}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <aside className="space-y-8 border-t border-slate-100 bg-slate-50 px-8 py-8 md:border-l md:border-t-0">
                    {personalInfo.linkedin || personalInfo.website || personalInfo.email || personalInfo.phone || personalInfo.location ? (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Contact</h2>
                            <div className="space-y-3 text-sm text-slate-700">
                                {personalInfo.email && <div className="flex items-center gap-2"><Mail className="size-4" style={{ color: accentColor }} /><span>{personalInfo.email}</span></div>}
                                {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="size-4" style={{ color: accentColor }} /><span>{personalInfo.phone}</span></div>}
                                {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="size-4" style={{ color: accentColor }} /><span>{personalInfo.location}</span></div>}
                                {personalInfo.linkedin && <div className="flex items-center gap-2"><FaLinkedin className="size-4" style={{ color: accentColor }} /><span className="break-all">{personalInfo.linkedin}</span></div>}
                                {personalInfo.website && <div className="flex items-center gap-2"><Globe className="size-4" style={{ color: accentColor }} /><span className="break-all">{personalInfo.website}</span></div>}
                            </div>
                        </section>
                    ) : null}

                    {skills.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Core Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className="rounded-full px-3 py-1 text-sm text-white" style={{ backgroundColor: accentColor }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <h3 className="font-semibold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                                        <p className="mt-1 text-slate-600">{edu.institution}</p>
                                        <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                                            <span>{formatDate(edu.graduation_date)}</span>
                                            {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {certificates.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Certificates</h2>
                            <ul className="space-y-2 pl-5 text-sm leading-relaxed text-slate-700 list-disc">
                                {certificates.map((certificate, index) => (
                                    <li key={index}>{typeof certificate === 'string' ? certificate : certificate.name || certificate.title || certificate.description}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {achievements.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Achievements</h2>
                            <ul className="space-y-2 pl-5 text-sm leading-relaxed text-slate-700 list-disc">
                                {achievements.map((achievement, index) => (
                                    <li key={index}>{typeof achievement === 'string' ? achievement : achievement.name || achievement.title || achievement.description}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {extracurricular.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: accentColor }}>Extracurricular</h2>
                            <ul className="space-y-2 pl-5 text-sm leading-relaxed text-slate-700 list-disc">
                                {extracurricular.map((activity, index) => (
                                    <li key={index}>{typeof activity === 'string' ? activity : activity.name || activity.title || activity.description}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    )
}

export default ExecutiveTemplate
