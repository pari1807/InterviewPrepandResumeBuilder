import React from 'react'

const TemplateSelector = ({selectedTemplate, onChange}) => {
    const [isOpen, setIsOpen] = useState(false);

    const templates = [
        {
            id: "classic",
            name : "Classic",
            preview: "A clean, traditional resume format with clear sections and professional typography"
        },
        {
            id: "modern",
            name: "Modern",
            preview: "Sleek design with strategic use of color and modern font choices"
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            preview: "Minimal design with a single image and clean typography"
        },
        {
            id: "minimal",
            name: "Minimal",
            preview: "Ultra-clean design that puts your content front and center"
        }
    ]
  return (
    <div className = 'relative'>
        <button>
            <Layout size={14} /> <span className = 'max-sm: hidden'>Template</span>
        </button>
    </div>
  )
}

export default TemplateSelector