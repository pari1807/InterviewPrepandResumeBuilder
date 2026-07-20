import Resume from "../models/Resume.js";
import imageKit from "../config/imageKit.js";
import fs from 'fs';

// Create a new resume
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const resumeData = req.body;

        const newResume = await Resume.create({
            ...resumeData,
            userId
        });

        return res.status(201).json({ message: "Resume created successfully", resume: newResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get all resumes of the authenticated user
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;
        const resumes = await Resume.find({ userId });
        return res.status(200).json({ resumes });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get a public resume by ID
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// =====================================================
// AI-CHANGE
// Date: 2026-07-20
// Reason: Keep resume builder properties in sync (project/projects, accentColor/accent_color) and add getResumeById for private resume loading.
// Changes: Implemented getResumeById controller. Added mappings in updateResume for project/projects and accentColor/accent_color field normalization.
// Connected Files: server/routes/resumeRouter.js, client/src/pages/ResumeBuilder.jsx
// =====================================================

// Update a resume
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy = {};
        if (resumeData) {
            resumeDataCopy = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
        }

        // Align project and accentColor fields for database serialization
        if (resumeDataCopy.project) {
            resumeDataCopy.projects = resumeDataCopy.project;
        } else if (resumeDataCopy.projects) {
            resumeDataCopy.project = resumeDataCopy.projects;
        }
        if (resumeDataCopy.accentColor) {
            resumeDataCopy.accent_color = resumeDataCopy.accentColor;
        } else if (resumeDataCopy.accent_color) {
            resumeDataCopy.accentColor = resumeDataCopy.accent_color;
        }

        if (image) {
            try {
                const imageBufferData = fs.createReadStream(image.path);

                const response = await imageKit.files.upload({
                    file: imageBufferData,
                    fileName: 'resume.png',
                    folder: 'user-resumes',
                    transformation: {
                        pre: 'w-300,h-300,fo-face,z-0.75' + 
                        (removeBackground ? ',e-bgremove' : '')
                    }
                });

                if (!resumeDataCopy.personal_info) {
                    resumeDataCopy.personal_info = {};
                }
                resumeDataCopy.personal_info.image = response.url;
            } finally {
                // Ensure local temporary file is removed to prevent storage leak
                try {
                    fs.unlinkSync(image.path);
                } catch (unlinkErr) {
                    console.error("Failed to delete temp file:", unlinkErr.message);
                }
            }
        }

        const resume = await Resume.findOneAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or unauthorized' });
        }

        return res.status(200).json({ message: 'Resume updated successfully', resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Delete a resume
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOneAndDelete({ userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or unauthorized" });
        }

        return res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get a private resume by ID
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ userId, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found or unauthorized" });
        }
        return res.status(200).json({ resume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
