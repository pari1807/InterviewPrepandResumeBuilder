import { Sparkles } from 'lucide-react'
import React from 'react'

const ProfessionalSummaryForm = ({data, onChange}) => {
  return (
    <div className="space-y-4">
        <div className = 'flex items-center justify-between gap-3'>
            <div>
                <h3 className = 'text-lg font-semibold text-slate-900'>
                    Professional Summary
                </h3>
                <p className = 'text-sm text-slate-500'>
                    Add Summary for your resume here 
                </p>
            </div>

            <button type="button" className = 'flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50'>
                <Sparkles className ='size-4' />
                AI Enhance
            </button>
        </div>

        <div className ='mt-6'>
            <textarea value = {data || ""}  onChange = {(e) => onChange(e.target.value)} rows = {6} className = 'mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100' placeholder='Write a concise professional summary that highlights your key strengths and career objectives...'/>

            <p className = 'mx-auto max-w-4xl text-center text-xs text-slate-500'>Tip: Keep it concise and focused on measurable experience, relevant skills, and target role fit.</p>
        </div>
    </div>
  )
}

export default ProfessionalSummaryForm