import React, { useState } from 'react';
import axios from 'axios';
import { Phone, AlertCircle } from 'lucide-react';
import '../styles/auth.css';

export default function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(null);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/send-otp', { phone });
      setShowOTPInput(true);
      setOtpExpiry(response.data.expiresIn);
      
      // Start countdown timer
      let timer = response.data.expiresIn;
      const interval = setInterval(() => {
        timer--;
        setOtpExpiry(timer);
        if (timer <= 0) clearInterval(interval);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/verify-otp', {
        phone,
        otp,
        companyName,
        email
      });

      onLogin(response.data.token, response.data.tenantId);
      window.location.href = '/onboarding';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Phone size={40} className="logo-icon" />
          <h1>Bolti AI</h1>
          <p>Parallel Voice Sales & Support Agent</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {!showOTPInput ? (
          <form onSubmit={handleSendOTP} className="login-form">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Business Name"
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
                placeholder="+91 XXXXX XXXXX"
                required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-login">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <p className="terms">
              By continuing, you agree to our Terms & Conditions
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="login-form">
            <div className="otp-info">
              <p>Enter the 6-digit OTP sent to</p>
              <p className="phone-display">{phone}</p>
              {otpExpiry && <p className="otp-timer">Expires in {otpExpiry}s</p>}
            </div>

            <div className="form-group">
              <label>OTP *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                required
                className="input-field otp-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-login">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOTPInput(false);
                setOtp('');
              }}
              className="btn-back"
            >
              ← Back
            </button>
          </form>
        )}
      </div>

      <div className="login-sidebar">
        <h2>Why Bolti AI?</h2>
        <ul>
          <li>✓ 1000+ concurrent calls</li>
          <li>✓ Hindi + English support</li>
          <li>✓ Knowledge Base integration</li>
          <li>✓ Human escalation ready</li>
          <li>✓ WhatsApp & SMS included</li>
          <li>✓ Enterprise-grade security</li>
        </ul>
      </div>
    </div>
  );
}
