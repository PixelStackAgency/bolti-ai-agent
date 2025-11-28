const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  
  // OTP verification
  otp: String,
  otpExpiry: Date,
  isVerified: { type: Boolean, default: false },
  
  // Session
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
