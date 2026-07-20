// =====================================================
// AI-CHANGE
// Date: 2026-07-20
// Reason: Register the generic section AI enhancement endpoint.
// Changes: Imported enhanceSection and added POST route for '/enhance-section'.
// Connected Files: server/controllers/aiController.js
// =====================================================
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { 
    enhanceJobDescription, 
    enhanceProfessionalSummary, 
    uploadResume,
    enhanceSection
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/enhance-section', protect, enhanceSection);
aiRouter.post('/upload-resume', protect, uploadResume);

export default aiRouter;