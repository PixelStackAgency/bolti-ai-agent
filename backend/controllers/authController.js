const User = require('../models/User');
const Tenant = require('../models/Tenant');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP (Mock - Replace with actual SMS provider)
const sendOTP = async (phone, otp) => {
  console.log(`[SMS] OTP sent to ${phone}: ${otp}`);
  // In production, integrate with Twilio/Exotel/AWS SNS
  return true;
};

exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }
    
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = new User({
        phone,
        isVerified: false
      });
    }
    
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    
    await sendOTP(phone, otp);
    
    res.json({ 
      message: 'OTP sent successfully',
      expiresIn: 600 // 10 minutes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp, companyName } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP required' });
    }
    
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ error: 'OTP expired' });
    }
    
    // Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.lastLogin = new Date();
    user.loginAttempts = 0;
    
    // Create tenant if first login
    if (!user.tenantId) {
      const tenantId = `tenant_${uuidv4().substring(0, 8)}`;
      
      const tenant = new Tenant({
        tenantId,
        companyName: companyName || 'New Company',
        phone,
        email: req.body.email || '',
        plan: 'starter',
        billingCycle: 'monthly',
        subscriptionStatus: 'inactive'
      });
      
      await tenant.save();
      user.tenantId = tenantId;
      user.role = 'admin';
    }
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        tenantId: user.tenantId,
        phone: user.phone
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tenantId: user.tenantId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-otp');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
