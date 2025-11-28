import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PhoneOff, Clock, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function CallHistoryPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', type: '', limit: 50 });

  useEffect(() => {
    fetchCalls();
  }, [filters]);

  const fetchCalls = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.get('/calls/history', { params: filters });
      setCalls(response.data.calls);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading calls...</div>;

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Call History</h1>
          <p>{calls.length} calls found</p>
        </div>

        <div className="filters-bar">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="escalated">Escalated</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
        </div>

        <table className="calls-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Status</th>
              <th>AI Resolution</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call._id} className="call-row">
                <td>{call.fromNumber}</td>
                <td>{call.toNumber}</td>
                <td>{call.type === 'inbound' ? 'Incoming' : 'Outgoing'}</td>
                <td><Clock size={14} /> {call.duration}s</td>
                <td>
                  <span className={`status-badge ${call.status}`}>
                    {call.status}
                  </span>
                </td>
                <td>
                  {call.resolvedByAI ? (
                    <span className="resolved-badge">✓ Resolved</span>
                  ) : (
                    <span className="escalated-badge">✗ Escalated</span>
                  )}
                </td>
                <td>{new Date(call.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {calls.length === 0 && (
          <div className="empty-state">
            <PhoneOff size={48} />
            <p>No calls found</p>
          </div>
        )}
      </main>
    </div>
  );
}
