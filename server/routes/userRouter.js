import express from "express";
import {
    getUserById,
    loginUser,
    registerUser,
    sendOTP,
    forgotPassword,
    resetPassword,
    updateProfile,
    requestEmailChange,
    confirmEmailChange,
    requestPasswordChange,
    confirmPasswordChange
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/send-otp', sendOTP);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
user

// Password Reset Routes
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Profile Update Routes
userRouter.post('/update-profile', protect, updateProfile);
userRouter.post('/request-email-change', protect, requestEmailChange);
userRouter.post('/confirm-email-change', protect, confirmEmailChange);
userRouter.post('/request-password-change', protect, requestPasswordChange);
userRouter.post('/confirm-password-change', protect, confirmPasswordChange);

export default userRouter;