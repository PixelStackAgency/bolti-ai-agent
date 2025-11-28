import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BillingPage from './pages/BillingPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import CampaignsPage from './pages/CampaignsPage';
import LeadsPage from './pages/LeadsPage';
import CallHistoryPage from './pages/CallHistoryPage';
import OnboardingPage from './pages/OnboardingPage';

// Configure axios
axios.defaults.baseURL = '/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tenantId, setTenantId] = useState(localStorage.getItem('tenantId'));

  const handleLogin = (newToken, newTenantId) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('tenantId', newTenantId);
    setToken(newToken);
    setTenantId(newTenantId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    setToken(null);
    setTenantId(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/onboarding" element={token ? <OnboardingPage /> : <Navigate to="/login" />} />
        <Route path="/" element={token ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/billing" element={token ? <BillingPage /> : <Navigate to="/login" />} />
        <Route path="/knowledge-base" element={token ? <KnowledgeBasePage /> : <Navigate to="/login" />} />
        <Route path="/campaigns" element={token ? <CampaignsPage /> : <Navigate to="/login" />} />
        <Route path="/leads" element={token ? <LeadsPage /> : <Navigate to="/login" />} />
        <Route path="/calls" element={token ? <CallHistoryPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
