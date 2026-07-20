import express from "express";
import {
    sendOTP,
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";
import {
    getUserById,
    updateProfile,
    requestEmailChange,
    confirmEmailChange,
    requestPasswordChange,
    confirmPasswordChange
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Authentication Routes
userRouter.post('/send-otp', sendOTP);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Profile & Account Settings Routes
userRouter.get('/data', protect, getUserById);
userRouter.post('/update-profile', protect, updateProfile);
userRouter.post('/request-email-change', protect, requestEmailChange);
userRouter.post('/confirm-email-change', protect, confirmEmailChange);
userRouter.post('/request-password-change', protect, requestPasswordChange);
userRouter.post('/confirm-password-change', protect, confirmPasswordChange);

export default userRouter;