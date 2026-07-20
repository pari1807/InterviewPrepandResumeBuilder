import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";
import {
    createResume,
    getUserResumes,
    getPublicResumeById,
    updateResume,
    deleteResume
} from "../controllers/resumeController.js";

const resumeRouter = express.Router();

// Private CRUD Resume Routes
resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/:resumeId', protect, deleteResume);
resumeRouter.get('/', protect, getUserResumes);

// Public Resume Route (no auth needed)
resumeRouter.get('/public/:resumeId', getPublicResumeById);

export default resumeRouter;