import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Phone, Users, TrendingUp, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function DashboardPage({ onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const [analyticsRes, callsRes] = await Promise.all([
        axios.get('/calls/analytics/30d'),
        axios.get('/calls/history?limit=10')
      ]);

      setAnalytics(analyticsRes.data);
      setRecentCalls(callsRes.data.calls);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar onLogout={onLogout} />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your call center performance.</p>
        </div>

        {analytics && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <Phone size={24} />
                </div>
                <div className="stat-content">
                  <h3>Total Calls (30d)</h3>
                  <p className="stat-value">{analytics.calls.total}</p>
                  <small>{analytics.calls.completed} completed</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <h3>AI Resolution Rate</h3>
                  <p className="stat-value">{analytics.calls.aiResolutionRate}%</p>
                  <small>{analytics.calls.resolvedByAI} calls handled by AI</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>Leads Generated</h3>
                  <p className="stat-value">{analytics.leads.total}</p>
                  <small>{analytics.leads.converted} converted ({analytics.leads.conversionRate}%)</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">
                  <Phone size={24} />
                </div>
                <div className="stat-content">
                  <h3>Escalations</h3>
                  <p className="stat-value">{analytics.calls.escalated}</p>
                  <small>To human agents</small>
                </div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-card">
                <h3>Call Volume Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { date: '1', calls: analytics.calls.total * 0.3 },
                    { date: '7', calls: analytics.calls.total * 0.6 },
                    { date: '15', calls: analytics.calls.total * 0.8 },
                    { date: '30', calls: analytics.calls.total }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calls" stroke="#667eea" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Call Outcomes</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Completed', value: analytics.calls.completed },
                    { name: 'Escalated', value: analytics.calls.escalated },
                    { name: 'Failed', value: analytics.calls.total - analytics.calls.completed - analytics.calls.escalated }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="recent-calls">
              <div className="section-header">
                <h3>Recent Calls</h3>
                <a href="/calls" className="view-all">View All →</a>
              </div>
              <table className="calls-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map((call) => (
                    <tr key={call._id}>
                      <td>{call.fromNumber}</td>
                      <td>{call.toNumber}</td>
                      <td><span className={`status ${call.status}`}>{call.status}</span></td>
                      <td>{call.duration}s</td>
                      <td>{call.type}</td>
                      <td>{new Date(call.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
