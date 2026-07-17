import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Otp from "../models/otp.js";
import nodemailer from "nodemailer";

const generateToken = (userId)=>{
    const token  =  jwt.sign({userId},process.env.JWT_SECRET, {expiresIn: '7d'});

    return token;
}

// Modern Professional Email HTML Template Generator
const getOTPEmailTemplate = (otp, purpose) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${purpose} OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 15px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .purpose-badge {
            display: inline-block;
            padding: 6px 16px;
            background-color: #ecfdf5;
            color: #047857;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 24px;
            border: 1px solid #a7f3d0;
        }
        .description {
            font-size: 16px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 30px;
        }
        .otp-box {
            font-size: 38px;
            font-weight: 800;
            letter-spacing: 6px;
            color: #047857;
            background-color: #f0fdfa;
            border: 2px dashed #34d399;
            padding: 16px 24px;
            border-radius: 16px;
            display: inline-block;
            margin-bottom: 30px;
        }
        .expiry-text {
            font-size: 13px;
            color: #94a3b8;
            margin-bottom: 24px;
        }
        .footer {
            background-color: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Resume Builder</h1>
            <p>AI-Powered Professional Resumes</p>
        </div>
        <div class="content">
            <span class="purpose-badge">${purpose}</span>
            <p class="description">We received a request to authorize a security action on your account. Please use the following One-Time Password (OTP) to verify your identity.</p>
            <div class="otp-box">${otp}</div>
            <p class="expiry-text">This security code is temporary and will expire in 5 minutes. Do not share this code with anyone.</p>
        </div>
        <div class="footer">
            <p>If you did not request this OTP, you can safely ignore this email.</p>
            <p>&copy; 2026 Resume Builder. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};

// Mail sending helper with dynamic ethereal mock account generation
const sendMailHelper = async (email, subject, otp, purpose) => {
    let transporter;
    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    console.log(`[SMTP Debug] hasSmtp: ${!!hasSmtp}`);
    console.log(`[SMTP Debug] SMTP_HOST: "${process.env.SMTP_HOST}"`);
    console.log(`[SMTP Debug] SMTP_PORT: "${process.env.SMTP_PORT}"`);
    console.log(`[SMTP Debug] SMTP_USER: "${process.env.SMTP_USER}"`);
    console.log(`[SMTP Debug] SMTP_PASS length: ${process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0}`);

    if (hasSmtp) {
        const isGmail = process.env.SMTP_HOST.includes("gmail");
        if (isGmail) {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                }
            });
        } else {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: parseInt(process.env.SMTP_PORT || "587") === 465,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
        }
    } else {
        // Dynamically create Ethereal account
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }

    const mailOptions = {
        from: process.env.SENDER_EMAIL || '"Resume Builder" <no-reply@resumebuilder.com>',
        to: email,
        subject: subject,
        text: `Your OTP code for ${purpose} is: ${otp}. It is valid for 5 minutes.`,
        html: getOTPEmailTemplate(otp, purpose)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP Debug] Mail sent status: Accepted=${JSON.stringify(info.accepted)}, Rejected=${JSON.stringify(info.rejected)}, MessageId=${info.messageId}`);
    
    // Log preview URL if it's ethereal
    if (!hasSmtp) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`\n------------------------------------\n[Mock Mailer] Ethereal Email Sent\nPreview URL: ${previewUrl}\n------------------------------------\n`);
    }
    return info;
};

// Controller to send OTP to email (Sign Up)
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database (upsert)
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, returnDocument: 'after' }
        );

        // Print to console for easy local testing
        console.log(`\n====================================\n[Sign Up OTP] Email: ${email} -> OTP: ${otp}\n====================================\n`);

        try {
            await sendMailHelper(email, "Verify your email address", otp, "Sign Up Verification");
            return res.status(200).json({ message: "OTP sent successfully (check server console too!)" });
        } catch (mailErr) {
            console.error("Error sending mail (sent via console instead):", mailErr.message);
            return res.status(200).json({ message: "OTP generated. (Check server logs/console for details)" });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Controller for user registration
//POST : /api/users/register
export const registerUser = async(req,res) => {
    try{
        const {name, email, password, otp} = req.body;

        //check if required fields are present
        if(!name || !email || !password || !otp){
            return res.status(400).json({message: 'Missing required fields'})
        }

        // Verify OTP
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        //check if user already exists
        const user  = await User.findOne({email})
        if(user){
            return res.status(400).json({message : 'User already exists'})
        }

        //create new user 
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        // Delete OTP after successful verification
        await Otp.deleteOne({ email });

        //return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({message: 'User created successfully', token, user: newUser})
    }catch(error){
            return res.status(400).json({message: error.message})
    }
}

//controller for user login
//POST : /api/users/login
export const loginUser = async(req,res) => {
    try{
        const { email, password} = req.body;

        //check if user already exists
        const user  = await User.findOne({email})
        if(!user){
            return res.status(400).json({message : 'Invalid Email or Password'})
        }

        //check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        //return success message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({message: 'Login successful', token, user})
    }catch(error){
            return res.status(400).json({message: error.message})
    }
}

//controller for getting user by id 
// GET: /api/users/data
export const getUserById =  async(req, res) => {
    try{
        const userId = req.userId;

        //check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        //return user
        user.password = undefined;
        return res.status(200).json({user})
    }catch(error){
        return res.status(400).json({message: error.message})
    }
}

// POST: /api/users/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Verify user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, returnDocument: 'after' }
        );

        console.log(`\n====================================\n[Password Reset OTP] Email: ${email} -> OTP: ${otp}\n====================================\n`);

        try {
            await sendMailHelper(email, "Reset your password", otp, "Reset Password");
            return res.status(200).json({ message: "Reset OTP sent successfully" });
        } catch (mailErr) {
            console.error("Mail error:", mailErr.message);
            return res.status(200).json({ message: "Reset OTP generated. (Check server logs/console for details)" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST: /api/users/reset-password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check OTP
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Update password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Delete OTP
        await Otp.deleteOne({ email });

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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