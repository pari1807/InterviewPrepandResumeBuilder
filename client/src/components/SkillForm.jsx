import { Plus, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'

const SkillForm = ({ data, onChange }) => {
    const [newSkill, setNewSkill] = useState('')

    const addSkill = () => {
        const skillValue = newSkill.trim()
        if (skillValue && !data.includes(skillValue)) {
            onChange([...data, skillValue])
            setNewSkill('')
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            addSkill()
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
                <p className="text-sm text-slate-500">Add simple comma-ready skills that can be grouped in the resume.</p>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(event) => setNewSkill(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                    type="button"
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="size-4" />
                    Add
                </button>
            </div>

            {data.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {data.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800">
                            {skill}
                            <button type="button" onClick={() => removeSkill(index)} className="ml-1 rounded-full p-0.5 transition-colors hover:bg-emerald-100">
                                <X className="size-3" />
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-slate-500">
                    <Sparkles className="mx-auto size-12 text-slate-300" />
                    <p className="mt-2 font-medium text-slate-700">No skills added yet</p>
                    <p className="text-sm">Add technical and domain skills you want grouped in the resume.</p>
                </div>
            )}

            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <strong>Tip:</strong> Add 8-12 relevant skills across languages, frameworks, and tools.
            </div>
        </div>
    )
}

export default SkillForm