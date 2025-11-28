const Subscription = require('../models/Subscription');
const Tenant = require('../models/Tenant');
const { v4: uuidv4 } = require('uuid');

// Pricing configuration
const PRICING = {
  monthly: {
    starter: { amount: 8000, minutes: 5000, campaigns: 2 },
    growth: { amount: 20000, minutes: 20000, campaigns: -1 }, // -1 = unlimited
    enterprise: { amount: 50000, minutes: 100000, campaigns: -1 }
  },
  yearly: {
    starter: { amount: 88000, minutes: 5000, campaigns: 2, originalAmount: 96000 },
    growth: { amount: 215000, minutes: 20000, campaigns: -1, originalAmount: 240000 },
    enterprise: { amount: 540000, minutes: 100000, campaigns: -1, originalAmount: 600000 }
  }
};

exports.getPlans = async (req, res) => {
  try {
    res.json({
      monthly: PRICING.monthly,
      yearly: PRICING.yearly
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { tenantId } = req;
    const { plan, billingCycle } = req.body;
    
    if (!plan || !billingCycle) {
      return res.status(400).json({ error: 'Plan and billing cycle required' });
    }
    
    if (!PRICING[billingCycle][plan]) {
      return res.status(400).json({ error: 'Invalid plan or billing cycle' });
    }
    
    const pricing = PRICING[billingCycle][plan];
    
    // Create Razorpay subscription (mock)
    const razorpaySubscriptionId = `sub_${uuidv4().substring(0, 12)}`;
    const razorpayCustomerId = `cust_${uuidv4().substring(0, 12)}`;
    const razorpayPlanId = `plan_${plan}_${billingCycle}`;
    
    const subscription = new Subscription({
      tenantId,
      plan,
      billingCycle,
      amount: pricing.amount,
      monthlyCallMinutes: pricing.minutes,
      campaigns: pricing.campaigns || 0,
      originalAmount: pricing.originalAmount || pricing.amount,
      discountApplied: !!pricing.originalAmount,
      discountPercentage: pricing.originalAmount ? 
        Math.round(((pricing.originalAmount - pricing.amount) / pricing.originalAmount) * 100) : 0,
      razorpaySubscriptionId,
      razorpayCustomerId,
      razorpayPlanId,
      status: 'pending',
      startDate: new Date(),
      currentPeriodStart: new Date(),
      currentPeriodEnd: billingCycle === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      nextBillingDate: billingCycle === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });
    
    await subscription.save();
    
    // Update tenant
    await Tenant.findOneAndUpdate(
      { tenantId },
      {
        plan,
        billingCycle,
        subscriptionStatus: 'pending',
        razorpaySubscriptionId,
        razorpayCustomerId,
        monthlyCallMinutes: pricing.minutes
      }
    );
    
    // Generate Razorpay payment link (mock)
    const paymentLink = `https://rzp.io/l/${razorpaySubscriptionId}`;
    
    res.json({
      subscription: subscription,
      paymentLink,
      message: 'Subscription created. Please complete payment.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const { tenantId } = req;
    
    const subscription = await Subscription.findOne({ tenantId });
    
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription' });
    }
    
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body;
    
    // Mock webhook handler - verify signature in production
    if (event === 'subscription.activated') {
      const { subscription_id } = payload.subscription;
      
      const subscription = await Subscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscription_id },
        { status: 'active' },
        { new: true }
      );
      
      if (subscription) {
        await Tenant.findOneAndUpdate(
          { tenantId: subscription.tenantId },
          { subscriptionStatus: 'active' }
        );
      }
    }
    
    if (event === 'subscription.completed') {
      const { subscription_id } = payload.subscription;
      
      const subscription = await Subscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscription_id },
        { status: 'completed' },
        { new: true }
      );
      
      if (subscription) {
        await Tenant.findOneAndUpdate(
          { tenantId: subscription.tenantId },
          { subscriptionStatus: 'inactive' }
        );
      }
    }
    
    if (event === 'subscription.cancelled') {
      const { subscription_id } = payload.subscription;
      
      await Subscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscription_id },
        { status: 'cancelled', cancelledAt: new Date() },
        { new: true }
      );
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { tenantId } = req;
    
    const subscription = await Subscription.findOneAndUpdate(
      { tenantId },
      { 
        status: 'cancelled',
        cancelledAt: new Date()
      },
      { new: true }
    );
    
    await Tenant.findOneAndUpdate(
      { tenantId },
      { subscriptionStatus: 'cancelled' }
    );
    
    res.json({ message: 'Subscription cancelled', subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
