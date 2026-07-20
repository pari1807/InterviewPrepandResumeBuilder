// =====================================================
// AI-CHANGE
// Date: 2026-07-20
// Reason: Handle transient 503 Service Unavailable and 429 Rate Limit spikes on the Gemini API.
// Changes: Implemented generateContentWithRetry containing exponential backoff, randomized jitter, and model-level fallbacks. Added user-friendly transient error responses.
// Connected Files: server/routes/aiRoutes.js, server/config/ai.js
// =====================================================
import Resume from "../models/Resume.js";
import ai from "../config/ai.js";

// Senior Backend Developer Best Practice: Exponential backoff with jitter and API model fallbacks
// Exposes robust retries for transient 503 (temporary high demand) or 429 (rate limits) service errors.
const generateContentWithRetry = async (payload, maxRetries = 3) => {
    let attempt = 0;
    let delay = 1000; // Start with 1 second initial delay
    const models = [
        process.env.GEMINI_MODEL || "gemini-2.5-flash",
        "gemini-2.5-flash", 
        "gemini-2.0-flash", 
        "gemini-1.5-flash"
    ];

    // Filter out duplicates to preserve retry order
    const uniqueModels = [...new Set(models)];

    while (attempt < maxRetries) {
        const currentModel = uniqueModels[attempt % uniqueModels.length];
        try {
            console.log(`[AI-Retry] Attempt ${attempt + 1}: Contacting Gemini API using model: ${currentModel}...`);
            const requestPayload = {
                ...payload,
                model: currentModel
            };
            const response = await ai.models.generateContent(requestPayload);
            return response;
        } catch (error) {
            attempt++;
            // Detect if this is a transient unavailable, rate limit, or high demand load issue
            const isTransient = error.status === 503 || error.status === 429 || 
                                (error.message && (
                                    error.message.includes('503') || 
                                    error.message.includes('429') || 
                                    error.message.includes('demand') || 
                                    error.message.includes('Rate limit') ||
                                    error.message.includes('UNAVAILABLE')
                                ));

            if (attempt >= maxRetries || !isTransient) {
                console.error(`[AI-Retry] Final generation attempt failed:`, error);
                throw error;
            }

            // Exponential backoff + randomized jitter (to avoid thundering herd problem)
            const jitter = Math.random() * 200;
            const backoffDelay = delay * Math.pow(2, attempt - 1) + jitter;
            console.warn(`[AI-Retry] Gemini API transient failure. Retrying in ${Math.round(backoffDelay)}ms. Context: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
    }
};

// Controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await generateContentWithRetry({
            contents: userContent,
            config: {
                systemInstruction: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return the enhanced text with no introduction, markdown formatting, or options."
            }
        });

        const enhancedContent = response.text;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        const isTransient = error.status === 503 || error.status === 429 || 
                            (error.message && (
                                error.message.includes('503') || 
                                error.message.includes('429') || 
                                error.message.includes('demand') || 
                                error.message.includes('Rate limit') ||
                                error.message.includes('UNAVAILABLE')
                            ));
        const userFriendlyMessage = isTransient 
            ? "Gemini AI servers are currently experiencing extremely high demand. Please try clicking the AI Enhance button again in a few seconds." 
            : error.message;
        return res.status(isTransient ? 503 : 400).json({ message: userFriendlyMessage });
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

        const response = await generateContentWithRetry({
            contents: userContent,
            config: {
                systemInstruction: "You are an expert in resume writing. Your task is to enhance the Job description of a resume. The Job description should be only in 1-2 sentences also highlighting key achievements and responsibilities. Use action verbs and quantifiable results where possible. Make it ATS-friendly. Only return the enhanced text with no introduction, markdown formatting, or options."
            }
        });

        const enhancedContent = response.text;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        const isTransient = error.status === 503 || error.status === 429 || 
                            (error.message && (
                                error.message.includes('503') || 
                                error.message.includes('429') || 
                                error.message.includes('demand') || 
                                error.message.includes('Rate limit') ||
                                error.message.includes('UNAVAILABLE')
                            ));
        const userFriendlyMessage = isTransient 
            ? "Gemini AI servers are currently experiencing extremely high demand. Please try clicking the AI Enhance button again in a few seconds." 
            : error.message;
        return res.status(isTransient ? 503 : 400).json({ message: userFriendlyMessage });
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

        const response = await generateContentWithRetry({
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
        const isTransient = error.status === 503 || error.status === 429 || 
                            (error.message && (
                                error.message.includes('503') || 
                                error.message.includes('429') || 
                                error.message.includes('demand') || 
                                error.message.includes('Rate limit') ||
                                error.message.includes('UNAVAILABLE')
                            ));
        const userFriendlyMessage = isTransient 
            ? "Gemini AI servers are currently experiencing extremely high demand. Please try again in a few seconds." 
            : error.message;
        return res.status(isTransient ? 503 : 400).json({ message: userFriendlyMessage });
    }
};

// Controller for generic section enhancement using AI
// POST: /api/ai/enhance-section
export const enhanceSection = async (req, res) => {
    try {
        const { section, userContent } = req.body;

        if (!section || !userContent) {
            return res.status(400).json({ message: 'Missing required fields: section and userContent' });
        }

        let systemInstruction = "";
        switch (section.toLowerCase()) {
            case 'summary':
            case 'professional_summary':
                systemInstruction = "You are an expert in resume writing. Enhance the professional summary of a resume. The summary should be 1-2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return the enhanced text with no introduction, markdown formatting, or options.";
                break;
            case 'experience':
            case 'job_description':
            case 'description':
                systemInstruction = "You are an expert in resume writing. Enhance the job description/experience bullet point. Focus on highlights, achievements, and responsibilities. Use strong action verbs and metrics where possible. Make it ATS-friendly. Only return the enhanced text with no introduction, markdown formatting, or options.";
                break;
            case 'project':
            case 'projects':
                systemInstruction = "You are an expert in resume writing. Enhance the project description. Highlight the technologies used, challenge faced, and outcomes achieved. Make it ATS-friendly. Only return the enhanced text with no introduction, markdown formatting, or options.";
                break;
            case 'education':
                systemInstruction = "You are an expert in resume writing. Enhance the education description or details to emphasize honors, relevant coursework, or extracurricular focus. Only return the enhanced text with no introduction, markdown formatting, or options.";
                break;
            case 'skills':
                systemInstruction = "You are an expert in resume writing. Organize and enhance the skills listed. Standardize naming conventions and present them in a clean, professional, and ATS-friendly comma-separated list. Only return the enhanced text with no introduction, markdown formatting, or options.";
                break;
            default:
                systemInstruction = "You are an expert in resume writing. Enhance the provided resume content to be professional, compelling, and ATS-friendly. Only return the enhanced text with no introduction, markdown formatting, or options.";
        }

        const response = await generateContentWithRetry({
            contents: userContent,
            config: {
                systemInstruction: systemInstruction
            }
        });

        const enhancedContent = response.text;
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        const isTransient = error.status === 503 || error.status === 429 || 
                            (error.message && (
                                error.message.includes('503') || 
                                error.message.includes('429') || 
                                error.message.includes('demand') || 
                                error.message.includes('Rate limit') ||
                                error.message.includes('UNAVAILABLE')
                            ));
        const userFriendlyMessage = isTransient 
            ? "Gemini AI servers are currently experiencing extremely high demand. Please try clicking the AI Enhance button again in a few seconds." 
            : error.message;
        return res.status(isTransient ? 503 : 400).json({ message: userFriendlyMessage });
    }
};