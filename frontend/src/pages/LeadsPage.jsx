import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const params = filter !== 'all' ? { status: filter } : {};
      const response = await axios.get('/leads', { params });
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading leads...</div>;

  const statuses = {
    new: { color: 'blue', label: 'New' },
    contacted: { color: 'yellow', label: 'Contacted' },
    converted: { color: 'green', label: 'Converted' },
    lost: { color: 'red', label: 'Lost' }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Leads</h1>
          <p>{leads.length} total leads</p>
        </div>

        <div className="leads-filter">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            All ({leads.length})
          </button>
          <button onClick={() => setFilter('new')} className={filter === 'new' ? 'active' : ''}>
            New
          </button>
          <button onClick={() => setFilter('contacted')} className={filter === 'contacted' ? 'active' : ''}>
            Contacted
          </button>
          <button onClick={() => setFilter('converted')} className={filter === 'converted' ? 'active' : ''}>
            Converted
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>No leads found</p>
          </div>
        ) : (
          <div className="leads-grid">
            {leads.map((lead) => (
              <div key={lead._id} className="lead-card">
                <div className="lead-header">
                  <h3>{lead.name || 'Unknown'}</h3>
                  <span className={`status-badge ${lead.status}`}>
                    {statuses[lead.status]?.label || lead.status}
                  </span>
                </div>
                <div className="lead-info">
                  <p><strong>Phone:</strong> {lead.phone}</p>
                  {lead.email && <p><strong>Email:</strong> {lead.email}</p>}
                  <p><strong>Query:</strong> {lead.query || 'N/A'}</p>
                </div>
                <div className="lead-footer">
                  <small>{new Date(lead.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
