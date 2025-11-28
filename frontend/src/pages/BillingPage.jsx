import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function BillingPage() {
  const [plans, setPlans] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCycle, setSelectedCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const [plansRes, subRes] = await Promise.all([
        axios.get('/billing/plans'),
        axios.get('/billing/subscription').catch(() => null)
      ]);

      setPlans(plansRes.data);
      if (subRes?.data) {
        setSubscription(subRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.post('/billing/subscribe', {
        plan,
        billingCycle: selectedCycle
      });

      // Redirect to Razorpay payment link (mock)
      window.location.href = response.data.paymentLink;
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error.response?.data?.error || 'Failed to create subscription');
    }
  };

  if (loading) {
    return <div className="loading">Loading billing...</div>;
  }

  const PLAN_FEATURES = {
    starter: [
      { icon: '✓', text: '5,000 AI call minutes/month' },
      { icon: '✓', text: '2 outbound campaigns/month' },
      { icon: '✓', text: '1 verified caller ID' },
      { icon: '✓', text: '5 PDF Knowledge Base uploads' },
      { icon: '✓', text: '1 website URL scrape' },
      { icon: '✓', text: '1 human escalation number' },
      { icon: '✓', text: '7-day data retention' },
      { icon: '✗', text: 'WhatsApp & SMS', disabled: true },
      { icon: '✗', text: 'Analytics Dashboard', disabled: true }
    ],
    growth: [
      { icon: '✓', text: '20,000 AI call minutes/month' },
      { icon: '✓', text: 'Unlimited campaigns' },
      { icon: '✓', text: '3 verified caller IDs' },
      { icon: '✓', text: '20+ PDF uploads' },
      { icon: '✓', text: '5 website sources' },
      { icon: '✓', text: '2 human escalation numbers' },
      { icon: '✓', text: '30-day data retention' },
      { icon: '✓', text: 'WhatsApp & SMS automation' },
      { icon: '✓', text: 'Analytics Dashboard' }
    ],
    enterprise: [
      { icon: '✓', text: '100,000+ AI call minutes/month' },
      { icon: '✓', text: 'No campaign limits' },
      { icon: '✓', text: 'Unlimited caller IDs' },
      { icon: '✓', text: 'Unlimited PDF & URL sources' },
      { icon: '✓', text: '5+ escalation numbers' },
      { icon: '✓', text: 'Sentiment analysis & intent extraction' },
      { icon: '✓', text: '90-day retention + audit logs' },
      { icon: '✓', text: 'Brand voice cloning' },
      { icon: '✓', text: '24×7 priority support' }
    ]
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Billing & Plans</h1>
          <p>Choose the perfect plan for your business</p>
        </div>

        {subscription && subscription.status === 'active' && (
          <div className="current-plan-banner">
            <AlertCircle size={20} />
            <div>
              <strong>Current Plan: {subscription.plan.toUpperCase()}</strong>
              <p>Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <div className="billing-controls">
          <div className="cycle-toggle">
            <button
              className={selectedCycle === 'monthly' ? 'active' : ''}
              onClick={() => setSelectedCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={selectedCycle === 'yearly' ? 'active' : ''}
              onClick={() => setSelectedCycle('yearly')}
            >
              Yearly <span className="badge">Save 8-10%</span>
            </button>
          </div>
        </div>

        {plans && (
          <div className="plans-grid">
            {['starter', 'growth', 'enterprise'].map((planKey) => {
              const planData = plans[selectedCycle][planKey];
              const isCurrentPlan = subscription?.plan === planKey;
              const discount = planData.originalAmount ? 
                Math.round(((planData.originalAmount - planData.amount) / planData.originalAmount) * 100) : 0;

              return (
                <div key={planKey} className={`plan-card ${isCurrentPlan ? 'current' : ''} ${planKey === 'growth' ? 'featured' : ''}`}>
                  {planKey === 'growth' && <div className="popular-badge">MOST POPULAR</div>}
                  {discount > 0 && <div className="discount-badge">Save {discount}%</div>}

                  <div className="plan-header">
                    <h3>{planKey.charAt(0).toUpperCase() + planKey.slice(1)}</h3>
                    <div className="price">
                      <span className="currency">₹</span>
                      <span className="amount">{(planData.amount / (selectedCycle === 'yearly' ? 12 : 1)).toLocaleString()}</span>
                      <span className="period">/{selectedCycle === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    {planData.originalAmount && (
                      <p className="original-price">
                        Was ₹{(planData.originalAmount / (selectedCycle === 'yearly' ? 12 : 1)).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="plan-features">
                    {PLAN_FEATURES[planKey].map((feature, idx) => (
                      <div key={idx} className={`feature ${feature.disabled ? 'disabled' : ''}`}>
                        <span className="icon">{feature.icon}</span>
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`plan-button ${isCurrentPlan ? 'current-btn' : ''}`}
                    onClick={() => handleSubscribe(planKey)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? (
                      <>
                        <Check size={18} />
                        Current Plan
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I change plans anytime?</h4>
              <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer refunds?</h4>
              <p>We offer a 5-day money-back guarantee for yearly plans if not activated. No refunds for partial months.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all Razorpay payment methods including credit/debit cards, UPI, net banking, and wallets.</p>
            </div>
            <div className="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>Yes, cancel anytime. Your access continues until the end of your billing period.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
