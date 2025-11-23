import express from "express";
import User from "../Models/User.js";
import PendingUser from "../Models/PendingUser.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

// ----------------------
// TEMPORARY STORE
// ----------------------
let otpStore = {}; 
let forgotOtpStore = {};
let otpAttemptsStore = {};  // OTP attempt limit for signup
let loginAttempts = {};     // Track login failures

// ----------------------
// Send OTP for Signup
// ----------------------
router.post("/send-otp", async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingPending = await PendingUser.findOne({ email });

    if (existingUser || existingPending)
      return res.status(400).json({ message: "Email already registered or pending!" });

    // Limit OTP request to 5 times
    if (!otpAttemptsStore[email]) otpAttemptsStore[email] = 0;
    if (otpAttemptsStore[email] >= 5) {
      return res.status(429).json({ success: false, message: "OTP limit exceeded! Try later." });
    }

    otpAttemptsStore[email]++;

    const otp = Math.floor(1000 + Math.random() * 9000);
    otpStore[email] = { otp, name, mobile, timestamp: Date.now() };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP for Signup",
      text: `Hello ${name}, your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// ----------------------
// Verify OTP for Signup
// ----------------------
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) 
    return res.status(400).json({ success: false, message: "OTP expired or not requested" });

  if (otpStore[email].otp == otp) {
    const { name, mobile } = otpStore[email];

    let pending = await PendingUser.findOne({ email });
    if (!pending) {
      pending = new PendingUser({ name, email, mobile, otpVerified: true });
      await pending.save();
    }

    res.json({ success: true, message: "OTP verified!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// ----------------------
// Register User After OTP Verified
// ----------------------
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser || !pendingUser.otpVerified) {
      return res.status(400).json({ success: false, message: "OTP not verified!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      mobile: pendingUser.mobile,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });

    res.json({ success: true, message: "Account created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// ----------------------
// Login Route with Attempt Security
// ----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!loginAttempts[email]) {
      loginAttempts[email] = { attempts: 0, blockUntil: null };
    }

    const { attempts, blockUntil } = loginAttempts[email];
    const currentTime = Date.now();

    if (blockUntil && currentTime < blockUntil) {
      const remaining = Math.ceil((blockUntil - currentTime) / 60000);
      return res.status(429).json({
        success: false,
        message: `Account blocked! Try after ${remaining} minutes.`,
      });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      loginAttempts[email].attempts++;

      if (loginAttempts[email].attempts >= 5) {
        loginAttempts[email].blockUntil = currentTime + 30 * 60 * 1000;
        return res.status(429).json({
          success: false,
          message: "Too many attempts! Blocked for 30 minutes.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Invalid password! Attempts left: ${5 - loginAttempts[email].attempts}`,
      });
    }

    // SUCCESS → Reset login attempts
    loginAttempts[email] = { attempts: 0, blockUntil: null };

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ----------------------
// Forgot Password - Send OTP
// ----------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Email not registered!" });

    const otp = Math.floor(1000 + Math.random() * 9000);
    forgotOtpStore[email] = { otp, timestamp: Date.now() };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "OTP sending failed" });
  }
});

// ----------------------
// Forgot Password - Verify OTP
// ----------------------
router.post("/forgot-password/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const record = forgotOtpStore[email];
  if (!record)
    return res.status(400).json({ success: false, message: "OTP expired!" });

  if (record.otp == otp) {
    res.json({ success: true, message: "OTP verified!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP!" });
  }
});

// ----------------------
// Forgot Password - Reset Password
// ----------------------
router.put("/forgot-password/reset", async (req, res) => {
  const { email, password } = req.body;

  if (!forgotOtpStore[email])
    return res.status(400).json({ success: false, message: "OTP not verified!" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    delete forgotOtpStore[email];

    res.json({ success: true, message: "Password Updated!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating password!" });
  }
});

export default router;
