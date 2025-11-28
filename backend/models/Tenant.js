const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  industryType: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Verified caller IDs (Exotel)
  verifiedNumbers: [{
    number: String,
    isVerified: Boolean,
    exotelSid: String
  }],
  
  // Human escalation
  escalationNumbers: [{
    number: String,
    agentName: String,
    available: Boolean
  }],
  
  // Subscription
  plan: { type: String, enum: ['starter', 'growth', 'enterprise'], default: 'starter' },
  billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
  razorpaySubscriptionId: String,
  razorpayCustomerId: String,
  nextBillingDate: Date,
  
  // Knowledge Base settings
  knowledgeBaseSources: [{
    type: { type: String, enum: ['pdf', 'url', 'text'] },
    source: String,
    uploadedAt: Date,
    chunkCount: Number
  }],
  
  // Settings
  aiLanguage: { type: String, default: 'en', enum: ['en', 'hi', 'kn', 'ta', 'te', 'ml'] },
  callTimeout: { type: Number, default: 120 }, // seconds
  recordingEnabled: { type: Boolean, default: true },
  whatsappEnabled: { type: Boolean, default: false },
  smsEnabled: { type: Boolean, default: false },
  sentimentAnalysis: { type: Boolean, default: false },
  dndEnabled: { type: Boolean, default: true },
  
  // API keys (encrypted)
  exotelApiKey: String,
  exotelApiToken: String,
  
  // Limits
  monthlyCallMinutes: { type: Number, default: 5000 },
  usedCallMinutes: { type: Number, default: 0 },
  monthlyCallsReset: Date,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  onboardingCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Tenant', tenantSchema);
