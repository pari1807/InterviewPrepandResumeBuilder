import Resume from "../models/Resume.js";
import ai from "../config/ai.js";

// Controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            contents: userContent,
            config: {
                systemInstruction: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return the enhanced text with no introduction, markdown formatting, or options."
            }
        });

        const enhancedContent = response.text;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            contents: userContent,
            config: {
                systemInstruction: "You are an expert in resume writing. Your task is to enhance the Job description of a resume. The Job description should be only in 1-2 sentences also highlighting key achievements and responsibilities. Use action verbs and quantifiable results where possible. Make it ATS-friendly. Only return the enhanced text with no introduction, markdown formatting, or options."
            }
        });

        const enhancedContent = response.text;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Controller for uploading/parsing a resume using AI
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            contents: `Extract the resume data from the following text:\n\n${resumeText}`,
            config: {
                systemInstruction: "You are an expert AI agent designed to extract structured data from unstructured resume text. Ensure all fields are extracted and matched accurately to the requested schema. Use standard values for boolean flags.",
                response_mime_type: "application/json",
                response_schema: {
                    type: "OBJECT",
                    properties: {
                        title: { type: "STRING" },
                        template: { type: "STRING" },
                        accent_color: { type: "STRING" },
                        professional_summary: { type: "STRING" },
                        skills: { type: "ARRAY", items: { type: "STRING" } },
                        personal_info: {
                            type: "OBJECT",
                            properties: {
                                full_name: { type: "STRING" },
                                profession: { type: "STRING" },
                                email: { type: "STRING" },
                                phone: { type: "STRING" },
                                location: { type: "STRING" },
                                linkedin: { type: "STRING" },
                                website: { type: "STRING" },
                            }
                        },
                        experience: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    company: { type: "STRING" },
                                    position: { type: "STRING" },
                                    start_date: { type: "STRING" },
                                    end_date: { type: "STRING" },
                                    descrption: { type: "STRING" },
                                    is_current: { type: "BOOLEAN" }
                                }
                            }
                        },
                        projects: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    name: { type: "STRING" },
                                    type: { type: "STRING" },
                                    description: { type: "STRING" }
                                }
                            }
                        },
                        education: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    institution: { type: "STRING" },
                                    degree: { type: "STRING" },
                                    field: { type: "STRING" },
                                    graduation_date: { type: "STRING" },
                                    gpa: { type: "STRING" }
                                }
                            }
                        }
                    }
                }
            }
        });

        const extractedData = response.text;
        const parsedData = JSON.parse(extractedData);

        const newResume = await Resume.create({
            ...parsedData,
            userId,
            title: title || parsedData.title || 'Untitled Resume'
        });

        return res.status(201).json({ resumeId: newResume._id });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};