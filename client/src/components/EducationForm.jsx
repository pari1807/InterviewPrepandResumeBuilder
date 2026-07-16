import React from 'react'
import SectionListEditor from './SectionListEditor'

const EducationForm = ({ data, onChange }) => {
    return (
        <SectionListEditor
            title="Education"
            description="Keep entries compact and list the degree details recruiters scan first."
            data={data}
            onChange={onChange}
            itemLabel="Education"
            addLabel="Add Education"
            emptyTitle="No education added yet"
            emptyDescription="Add the most relevant degree or program first."
            createItem={() => ({ institution: '', degree: '', field: '', graduation_date: '', gpa: '' })}
            getItemSummary={(item) => [item.degree, item.institution].filter(Boolean).join(' • ')}
            fields={[
                { key: 'degree', label: 'Degree', placeholder: 'B.Tech in Computer Science', fullWidth: true },
                { key: 'institution', label: 'Institution', placeholder: 'University of Example' },
                { key: 'field', label: 'Branch / Field', placeholder: 'Computer Science' },
                { key: 'graduation_date', label: 'Graduation Date', type: 'month', placeholder: '2025-05' },
                { key: 'gpa', label: 'CGPA (optional)', placeholder: '8.8' },
            ]}
        />
    )
}

export default EducationForm