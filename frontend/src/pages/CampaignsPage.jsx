import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    type: 'sales'
  });

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    // Mock campaign creation
    const campaign = {
      id: Math.random().toString(36),
      ...newCampaign,
      status: 'draft',
      createdAt: new Date()
    };
    setCampaigns([...campaigns, campaign]);
    setNewCampaign({ name: '', description: '', type: 'sales' });
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Campaigns</h1>
          <p>Manage your outbound calling campaigns</p>
        </div>

        <div className="campaign-create">
          <form onSubmit={handleCreateCampaign} className="create-form">
            <input
              type="text"
              placeholder="Campaign Name"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              required
              className="input-field"
            />
            <textarea
              placeholder="Campaign Description"
              value={newCampaign.description}
              onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              className="input-field"
              rows="3"
            />
            <select
              value={newCampaign.type}
              onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
              className="input-field"
            >
              <option value="sales">Sales Campaign</option>
              <option value="support">Support Campaign</option>
              <option value="survey">Survey Campaign</option>
            </select>
            <label className="upload-csv">
              <Upload size={18} />
              Upload CSV with Leads
              <input type="file" accept=".csv" hidden />
            </label>
            <button type="submit" className="btn-primary">Create Campaign</button>
          </form>
        </div>

        {campaigns.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>No campaigns yet</p>
            <small>Create your first campaign to start calling</small>
          </div>
        ) : (
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Leads</th>
                <th>Calls</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{campaign.type}</td>
                  <td><span className={`status-badge ${campaign.status}`}>{campaign.status}</span></td>
                  <td>-</td>
                  <td>-</td>
                  <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
