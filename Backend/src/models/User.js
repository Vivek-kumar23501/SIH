const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  // NEW: Mobile number field
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        // Basic mobile number validation (10-15 digits, optional country code)
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please provide a valid mobile number'
    }
  },
  passwordHash: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only for non-Google auth
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  picture: {
    type: String,
    validate: [validator.isURL, 'Please provide a valid URL']
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  // NEW: Mobile verification field
  mobileVerified: {
    type: Boolean,
    default: false
  },
  // NEW OTP FIELDS (Added below existing fields)
  otp: {
    code: String,
    expiresAt: Date
  },
  otpAttempts: {
    type: Number,
    default: 0
  },
  otpBlockedUntil: Date,
  // Existing field remains unchanged
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Existing indexes remain
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
// NEW index for OTP cleanup
userSchema.index({ mobile: 1 }); // NEW: Index for mobile
userSchema.index({ 'otp.expiresAt': 1 });

// EXISTING METHODS (unchanged)
userSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 12);
};

// NEW OTP METHODS (Added below existing methods)

/**
 * Generate a new OTP for email verification
 * @returns {string} The generated OTP code
 */
userSchema.methods.generateOTP = function() {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  this.otp = {
    code: otpCode,
    expiresAt: expiresAt
  };
  
  this.otpAttempts = 0;
  this.otpBlockedUntil = null;
  
  return otpCode;
};

/**
 * Verify the entered OTP code
 * @param {string} enteredOTP - The OTP code entered by user
 * @returns {boolean} True if OTP is valid
 * @throws {Error} If OTP is invalid, expired, or blocked
 */
userSchema.methods.verifyOTP = function(enteredOTP) {
  // Check if OTP is blocked due to too many attempts
  if (this.otpBlockedUntil && this.otpBlockedUntil > new Date()) {
    throw new Error('Too many OTP attempts. Please try again later.');
  }
  
  // Check if OTP exists and is not expired
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    throw new Error('OTP not found or expired.');
  }
  
  if (this.otp.expiresAt < new Date()) {
    throw new Error('OTP has expired.');
  }
  
  // Verify OTP code
  if (this.otp.code !== enteredOTP) {
    this.otpAttempts += 1;
    
    // Block after 5 failed attempts for 15 minutes
    if (this.otpAttempts >= 5) {
      this.otpBlockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    
    throw new Error('Invalid OTP code.');
  }
  
  // OTP is valid - mark email as verified and clear OTP
  this.emailVerified = true;
  this.otp = undefined;
  this.otpAttempts = 0;
  this.otpBlockedUntil = null;
  
  return true;
};

/**
 * Check if OTP verification is required for this user
 * @returns {boolean} True if OTP verification is required
 */
userSchema.methods.isOTPVerificationRequired = function() {
  return !this.emailVerified && !this.googleId; // Require OTP for email users who haven't verified
};

/**
 * Check if OTP can be resent (not blocked)
 * @returns {boolean} True if OTP can be resent
 */
userSchema.methods.canResendOTP = function() {
  return !this.otpBlockedUntil || this.otpBlockedUntil <= new Date();
};

/**
 * Get remaining OTP attempts
 * @returns {number} Remaining attempts before blocking
 */
userSchema.methods.getRemainingAttempts = function() {
  return Math.max(0, 5 - this.otpAttempts);
};

module.exports = mongoose.model('User', userSchema);