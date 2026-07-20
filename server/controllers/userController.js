import User from "../models/user.js";
import bcrypt from 'bcrypt';
import Otp from "../models/otp.js";
import { sendMailHelper } from "./authController.js";

// Controller for getting user by ID
// GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return user
        user.password = undefined;
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// POST: /api/users/update-profile
export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        await user.save();
        user.password = undefined;

        return res.status(200).json({ message: "Profile name updated", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST: /api/users/request-email-change
export const requestEmailChange = async (req, res) => {
    try {
        const { newEmail } = req.body;
        if (!newEmail) {
            return res.status(400).json({ message: "New email is required" });
        }

        // Check if email already in use
        const existing = await User.findOne({ email: newEmail });
        if (existing) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP (associated with the NEW email)
        await Otp.findOneAndUpdate(
            { email: newEmail },
            { otp, createdAt: new Date() },
            { upsert: true, returnDocument: 'after' }
        );

        console.log(`\n====================================\n[Email Change OTP] New Email: ${newEmail} -> OTP: ${otp}\n====================================\n`);

        try {
            await sendMailHelper(newEmail, "Verify your new email address", otp, "Change Email");
            return res.status(200).json({ message: "OTP sent to new email address" });
        } catch (mailErr) {
            console.error("Mail error:", mailErr.message);
            return res.status(200).json({ message: "OTP generated. (Check server logs/console for details)" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST: /api/users/confirm-email-change
export const confirmEmailChange = async (req, res) => {
    try {
        const { newEmail, otp } = req.body;
        if (!newEmail || !otp) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Verify OTP
        const otpRecord = await Otp.findOne({ email: newEmail });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.email = newEmail;
        await user.save();
        user.password = undefined;

        await Otp.deleteOne({ email: newEmail });

        return res.status(200).json({ message: "Email changed successfully", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST: /api/users/request-password-change
export const requestPasswordChange = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.findOneAndUpdate(
            { email: user.email },
            { otp, createdAt: new Date() },
            { upsert: true, returnDocument: 'after' }
        );

        console.log(`\n====================================\n[Password Change OTP] Email: ${user.email} -> OTP: ${otp}\n====================================\n`);

        try {
            await sendMailHelper(user.email, "Verify password change request", otp, "Change Password");
            return res.status(200).json({ message: "OTP sent to your registered email address" });
        } catch (mailErr) {
            console.error("Mail error:", mailErr.message);
            return res.status(200).json({ message: "OTP generated. (Check server logs/console for details)" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST: /api/users/confirm-password-change
export const confirmPasswordChange = async (req, res) => {
    try {
        const { otp, newPassword } = req.body;
        if (!otp || !newPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify OTP
        const otpRecord = await Otp.findOne({ email: user.email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await Otp.deleteOne({ email: user.email });

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};