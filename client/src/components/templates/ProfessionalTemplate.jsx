import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import React from 'react'
import { formatDate, toBulletList } from './templateUtils'

const ProfessionalTemplate = ({ data, accentColor = '#10b981' }) => {
    const personalInfo = data?.personal_info || {}
    const experience = data?.experience || []
    const education = data?.education || []
    const skills = data?.skills || []
    const projects = data?.project || []
    const certificates = data?.certificates || data?.certifications || []
    const achievements = data?.achievements || []
    const extracurricular = data?.extracurricular_activities || data?.extracurricularActivities || data?.activities || []

    return (
        <div className="mx-auto max-w-4xl bg-white px-6 py-6 text-slate-800 md:px-8 md:py-8">
            <header className="mb-5 border-b border-slate-200 pb-4 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {personalInfo.full_name || 'Your Name'}
                </h1>

                <p className="mt-1 text-sm text-slate-700">
                    {[
                        personalInfo.location,
                        personalInfo.phone,
                        personalInfo.email,
                    ].filter(Boolean).join(' | ')}
                </p>

                <p className="mt-1 text-sm text-slate-700">
                    {personalInfo.linkedin || personalInfo.website ? [personalInfo.linkedin, personalInfo.website].filter(Boolean).join(' | ') : personalInfo.profession || ''}
                </p>
            </header>

            {data.professional_summary && (
                <section className="mb-4">
                    <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-900">Professional Summary</h2>
                    <p className="text-sm leading-6 text-slate-700">{data.professional_summary}</p>
                </section>
            )}

            {experience.length > 0 && (
                <section className="mb-4">
                    <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">Experience</h2>
                    <div className="space-y-3">
                        {experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex items-baseline justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">{exp.position}</h3>
                                        <p className="text-sm text-slate-700">{exp.company}</p>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                    </p>
                                </div>
                                {exp.description && (
                                    <ul className="mt-1 list-disc pl-4 text-sm leading-6 text-slate-700">
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
                <section className="mb-4">
                    <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">Projects</h2>
                    <div className="space-y-3">
                        {projects.map((project, index) => (
                            <div key={index}>
                                <div className="flex items-baseline justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">{project.name}</h3>
                                        {project.type && <p className="text-sm text-slate-700">{project.type}</p>}
                                    </div>
                                </div>
                                {project.description && (
                                    <ul className="mt-1 list-disc pl-4 text-sm leading-6 text-slate-700">
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

            {certificates.length > 0 && (
                <section className="mb-4">
                    <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">Certifications</h2>
                    <ul className="list-disc pl-4 text-sm leading-6 text-slate-700">
                        {certificates.map((certificate, index) => (
                            <li key={index}>{typeof certificate === 'string' ? certificate : certificate.name || certificate.title || certificate.description}</li>
                        ))}
                    </ul>
                </section>
            )}

            {achievements.length > 0 && (
                <section className="mb-4">
                    <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">Achievements</h2>
                    <ul className="list-disc pl-4 text-sm leading-6 text-slate-700">
                        {achievements.map((achievement, index) => (
                            <li key={index}>{typeof achievement === 'string' ? achievement : achievement.name || achievement.title || achievement.description}</li>
                        ))}
                    </ul>
                </section>
            )}

            {education.length > 0 && (
                <section className="mb-4">
                    <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">Education</h2>
                    <div className="space-y-2">
                        {education.map((edu, index) => (
                            <div key={index} className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                                    <p className="text-sm text-slate-700">{edu.institution}</p>
                                    {edu.gpa && <p className="text-xs text-slate-500">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-xs text-slate-500">{formatDate(edu.graduation_date)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {skills.length > 0 && (
                <section>
                    <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">Skills</h2>
                    <p className="text-sm leading-6 text-slate-700">{skills.join(' • ')}</p>
                </section>
            )}
        </div>
    )
}

export default ProfessionalTemplate
