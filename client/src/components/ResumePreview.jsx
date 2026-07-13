import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ProfessionalTemplate from './templates/ProfessionalTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'
import TwoColumnTemplate from './templates/TwoColumnTemplate'
import { buildPreviewVars } from './templates/templateUtils'

const ResumePreview = ({data, template, accentColor = "#10b981", settings, classes =""}) => {
    const previewVars = buildPreviewVars(settings)

    const renderTemplate = () => {
        switch(template){
            case "modern":
                return <ModernTemplate data ={data} accentColor = {accentColor} />;
            case "minimal":
                return <MinimalTemplate data ={data} accentColor = {accentColor} />;
            case "minimal-image":
                return <MinimalImageTemplate data ={data} accentColor = {accentColor} />;
            case "professional":
                return <ProfessionalTemplate data={data} accentColor={accentColor} />;
            case "executive":
                return <ExecutiveTemplate data={data} accentColor={accentColor} />;
            case "two-column":
                return <TwoColumnTemplate data={data} accentColor={accentColor} />;

            default:
                return <ClassicTemplate data={data} accentColor = {accentColor} />;
                
        }
    }
  return (
    <div className='w-full bg-slate-50 rounded-3xl' style={{ padding: `${settings?.pageMargin ?? 0.45}in` }}>
        <div id='resume-preview' style={previewVars} className={'resume-preview-shell overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_24px_80px_rgba(16,185,129,0.08)] print:shadow-none print:border-none ' + classes}>
            {renderTemplate()}
        </div>

        <style jsx>
            {`
            .resume-preview-shell {
                font-size: calc(15px * var(--resume-font-scale));
                line-height: var(--resume-line-spacing);
                margin: 0;
                font-family: Calibri, Inter, Arial, sans-serif;
            }

            .resume-preview-shell :is(h1, h2, h3, h4, h5, h6, p, li, span, div) {
                line-height: var(--resume-line-spacing);
            }

            .resume-preview-shell h1 {
                font-size: calc(1.9rem * var(--resume-heading-scale)) !important;
                line-height: 1.04 !important;
                letter-spacing: -0.02em;
            }

            .resume-preview-shell h2 {
                font-size: calc(0.86rem * var(--resume-heading-scale)) !important;
                line-height: 1.15 !important;
            }

            .resume-preview-shell h3 {
                font-size: calc(1rem * var(--resume-heading-scale)) !important;
                line-height: 1.2 !important;
            }

            .resume-preview-shell p,
            .resume-preview-shell li,
            .resume-preview-shell span {
                font-size: calc(0.88rem * var(--resume-font-scale));
            }

            .resume-preview-shell ul {
                margin-top: 0.25rem !important;
                padding-left: 1rem !important;
            }

            .resume-preview-shell li {
                margin-top: 0.12rem;
            }

            .resume-preview-shell section {
                margin-bottom: calc(0.9rem * var(--resume-section-spacing)) !important;
            }

            @page{
            size: letter;
            margin: 0;
            }

            @media print{
            html,body{
            width: 8.5in;
            height : 11in;
            overflow: hidden;
            }

            body * {
            visibility: hidden;
            }

            #resume-preview, #resume-preview * {
            visibility: visible;
            }

            #resume-preview{
            position:absolute;
            left: 0;
            top : 0;
            width : 100%;
            height : auto;
            margin : 0;
            padding : 0;
            box-shadow: none !important;
            border: none !important
            }

            #resume-preview .resume-preview-shell {
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
            }
            }
            `} 
        </style>
    </div>
  )
}

export default ResumePreview