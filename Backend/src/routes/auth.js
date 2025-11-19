const express = require('express');
const cookieParser = require('cookie-parser');
const User = require('../models/User');
const TokenManager = require('../utils/token');
const GoogleAuth = require('../utils/googleAuth');
const EmailService = require('../utils/emailService'); // NEW: Import email service
const { authenticateToken } = require('../middleware/auth');
const { loginLimiter, refreshLimiter } = require('../middleware/rateLimit');

const router = express.Router();
router.use(cookieParser());

// Email + Password Signup (Updated with Mobile)
router.post('/signup', loginLimiter, async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, mobile, and password are required'
      });
    }

    // Check if user already exists with email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // NEW: Check if user already exists with mobile
    const existingUserByMobile = await User.findOne({ mobile });
    if (existingUserByMobile) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this mobile number'
      });
    }

    // Hash password and create user
    const passwordHash = await User.hashPassword(password);
    const user = new User({
      name,
      email,
      mobile, // NEW: Add mobile number
      passwordHash,
      role: role || 'patient',
      emailVerified: false
    });

    await user.save();

    // Generate and send OTP
    const otpCode = user.generateOTP();
    await user.save();

    // Send OTP email
    const emailResult = await EmailService.sendOTPEmail(email, otpCode, name);

    res.status(201).json({
      success: true,
      message: 'User created successfully. OTP sent for email verification.',
      data: {
        userId: user._id,
        email: user.email,
        mobile: user.mobile, // NEW: Include mobile in response
        requiresVerification: true,
        emailSent: emailResult.success
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `User already exists with this ${field}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup'
    });
  }
});

// Email + Password Login (UPDATED with OTP check)
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user and check password
    const user = await User.findOne({ email });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // NEW: Check if email verification is required
    if (user.isOTPVerificationRequired()) {
      // Generate new OTP for verification
      const otpCode = user.generateOTP();
      await user.save();

      // Send OTP email
      await EmailService.sendOTPEmail(email, otpCode, user.name);

      return res.status(403).json({
        success: false,
        message: 'Email verification required',
        requiresVerification: true,
        data: {
          userId: user._id,
          email: user.email
        }
      });
    }

    // Generate tokens (only if email is verified)
    const accessToken = TokenManager.generateAccessToken({
      userId: user._id,
      role: user.role,
      emailVerified: user.emailVerified // NEW: Include email verification status
    });

    const { token: refreshToken, jti } = TokenManager.generateRefreshToken({
      userId: user._id
    });

    // Store refresh token in Redis and set cookie
    await TokenManager.storeRefreshToken(user._id, jti);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          emailVerified: user.emailVerified // NEW: Include verification status
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// Google Signup/Login (UNCHANGED - Google users are pre-verified)
router.post('/google', loginLimiter, async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google ID token
    const googleUser = await GoogleAuth.verifyIdToken(idToken);

    // Find existing user by Google ID or email
    let user = await User.findOne({
      $or: [
        { googleId: googleUser.googleId },
        { email: googleUser.email }
      ]
    });

    if (!user) {
      // Create new user
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        picture: googleUser.picture,
        emailVerified: googleUser.emailVerified // Google users are verified
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google account to existing email account
      user.googleId = googleUser.googleId;
      user.picture = googleUser.picture;
      user.emailVerified = googleUser.emailVerified; // Mark as verified when linking Google
      await user.save();
    }

    // Generate tokens
    const accessToken = TokenManager.generateAccessToken({
      userId: user._id,
      role: user.role,
      emailVerified: user.emailVerified // NEW: Include verification status
    });

    const { token: refreshToken, jti } = TokenManager.generateRefreshToken({
      userId: user._id
    });

    // Store refresh token and set cookie
    await TokenManager.storeRefreshToken(user._id, jti);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          emailVerified: user.emailVerified // NEW: Include verification status
        }
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

// NEW: Verify OTP Endpoint
router.post('/verify-otp', loginLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify OTP
    await user.verifyOTP(otp);
    await user.save();

    // NEW: Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.name);

    // Generate tokens after successful verification
    const accessToken = TokenManager.generateAccessToken({
      userId: user._id,
      role: user.role,
      emailVerified: true
    });

    const { token: refreshToken, jti } = TokenManager.generateRefreshToken({
      userId: user._id
    });

    // Store refresh token in Redis and set cookie
    await TokenManager.storeRefreshToken(user._id, jti);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile, // NEW: Include mobile
          role: user.role,
          picture: user.picture,
          emailVerified: user.emailVerified
        }
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// NEW: Resend OTP Endpoint
router.post('/resend-otp', loginLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check if OTP is blocked
    if (user.otpBlockedUntil && user.otpBlockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.otpBlockedUntil - new Date()) / 1000 / 60);
      return res.status(429).json({
        success: false,
        message: `Too many OTP attempts. Please try again in ${remainingTime} minutes.`
      });
    }

    // Generate new OTP
    const otpCode = user.generateOTP();
    await user.save();

    // Send OTP email
    const emailResult = await EmailService.sendOTPEmail(email, otpCode, user.name);

    res.json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        emailSent: emailResult.success
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
});

// Refresh Token Endpoint (UNCHANGED)
router.post('/refresh', refreshLimiter, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify and extract data from old refresh token
    const decoded = await TokenManager.verifyRefreshToken(refreshToken);
    
    // Revoke old refresh token
    await TokenManager.revokeRefreshToken(decoded.jti);

    // Generate new tokens
    const accessToken = TokenManager.generateAccessToken({
      userId: decoded.userId,
      role: decoded.role
    });

    const { token: newRefreshToken, jti } = TokenManager.generateRefreshToken({
      userId: decoded.userId
    });

    // Store new refresh token
    await TokenManager.storeRefreshToken(decoded.userId, jti);

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    
    // Clear invalid refresh token cookie
    res.clearCookie('refreshToken');
    
    res.status(403).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

// Logout Endpoint (UNCHANGED)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = await TokenManager.verifyRefreshToken(refreshToken);
        await TokenManager.revokeRefreshToken(decoded.jti);
      } catch (error) {
        // Continue with logout even if refresh token is invalid
      }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
});

// Protected Profile Route (UNCHANGED)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching profile'
    });
  }
});

module.exports = router;