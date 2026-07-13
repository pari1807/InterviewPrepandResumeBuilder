export const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month] = dateStr.split('-')
    return new Date(year, month - 1).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    })
}

export const toBulletList = (value) => {
    if (!value) return []

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'string') return item.trim()
                return item?.text || item?.name || item?.title || item?.description || ''
            })
            .filter(Boolean)
    }

    return String(value)
        .split(/\r?\n/)
        .map((line) => line.replace(/^[•\-\u2022]\s*/, '').trim())
        .filter(Boolean)
}

export const DEFAULT_LAYOUT_SETTINGS = {
    layoutMode: 'compact',
    fontScale: 1,
    headingScale: 1,
    lineSpacing: 1.32,
    sectionSpacing: 1,
    pageMargin: 0.45,
}

export const buildPreviewVars = (settings = DEFAULT_LAYOUT_SETTINGS) => ({
    '--resume-font-scale': settings.fontScale,
    '--resume-heading-scale': settings.headingScale,
    '--resume-line-spacing': settings.lineSpacing,
    '--resume-section-spacing': settings.sectionSpacing,
    '--resume-page-margin': `${settings.pageMargin}in`,
})
