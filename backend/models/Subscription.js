const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true },
  
  // Plan details
  plan: { type: String, enum: ['starter', 'growth', 'enterprise'], required: true },
  billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },
  
  // Pricing
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  
  // Razorpay details
  razorpaySubscriptionId: String,
  razorpayCustomerId: String,
  razorpayPlanId: String,
  
  // Status
  status: { type: String, enum: ['active', 'paused', 'cancelled', 'expired', 'pending'], default: 'pending' },
  
  // Dates
  startDate: Date,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  nextBillingDate: Date,
  cancelledAt: Date,
  
  // Payment history
  payments: [{
    paymentId: String,
    amount: Number,
    status: String,
    date: Date,
    invoiceUrl: String
  }],
  
  // Usage limits
  monthlyCallMinutes: Number,
  usedCallMinutes: { type: Number, default: 0 },
  campaigns: Number,
  usedCampaigns: { type: Number, default: 0 },
  
  // Discounts
  discountApplied: Boolean,
  discountPercentage: Number,
  originalAmount: Number,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
