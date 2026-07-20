import { GoogleGenAI } from "@google/genai";

const aiOptions = {
    apiKey: process.env.GEMINI_API_KEY,
};

if (process.env.GEMINI_BASE_URL) {
    aiOptions.baseUrl = process.env.GEMINI_BASE_URL;
}

const ai = new GoogleGenAI(aiOptions);

export default ai;
