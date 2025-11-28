import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    verifiedNumber: '',
    escalationNumber: '',
    industry: '',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (step === 3) {
      // Complete onboarding
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await axios.post('/tenant/complete-onboarding', formData);
        setCompleted(true);
        setTimeout(() => window.location.href = '/', 2000);
      } catch (error) {
        console.error('Onboarding error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  if (completed) {
    return (
      <div className="onboarding-success">
        <CheckCircle size={64} />
        <h2>🎉 Welcome to Bolti AI!</h2>
        <p>Your account is ready. Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="onboarding">
      <Navbar />

      <main className="onboarding-content">
        <div className="onboarding-header">
          <h1>Complete Your Setup</h1>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        <div className="onboarding-form">
          {step === 1 && (
            <div className="form-step">
              <h2>Business Information</h2>
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your company name"
                />
              </div>

              <div className="form-group">
                <label>Industry Type</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className="input-field">
                  <option value="">Select industry...</option>
                  <option value="retail">Retail</option>
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Primary Language</label>
                <select name="language" value={formData.language} onChange={handleChange} className="input-field">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="kn">Kannada</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Verify Your Caller ID</h2>
              <div className="form-group">
                <label>Verified Phone Number (Exotel) *</label>
                <input
                  type="tel"
                  name="verifiedNumber"
                  value={formData.verifiedNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+91 XXXXX XXXXX"
                />
                <small>This must be verified with Exotel. See dashboard for verification link.</small>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>Human Escalation Setup</h2>
              <div className="form-group">
                <label>Escalation Number (Support Team) *</label>
                <input
                  type="tel"
                  name="escalationNumber"
                  value={formData.escalationNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+91 XXXXX XXXXX"
                />
                <small>When AI can't resolve, we'll transfer to this number</small>
              </div>

              <div className="next-steps">
                <h3>✓ Ready to launch!</h3>
                <ul>
                  <li>Choose a plan from Billing</li>
                  <li>Upload knowledge base</li>
                  <li>Start receiving calls</li>
                </ul>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="btn-secondary"
            >
              ← Back
            </button>
            <button onClick={handleNext} disabled={loading} className="btn-primary">
              {step === 3 ? (loading ? 'Completing...' : 'Complete Setup') : 'Next →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
