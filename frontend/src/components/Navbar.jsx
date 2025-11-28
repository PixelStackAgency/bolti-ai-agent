import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Bell, User } from 'lucide-react';
import '../styles/navbar.css';

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    onLogout?.();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Bolti AI</h1>
        </div>

        <ul className="navbar-links">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/billing">Billing</a></li>
          <li><a href="/knowledge-base">Knowledge Base</a></li>
          <li><a href="/campaigns">Campaigns</a></li>
          <li><a href="/leads">Leads</a></li>
          <li><a href="/calls">Calls</a></li>
        </ul>

        <div className="navbar-actions">
          <button className="icon-btn" title="Notifications">
            <Bell size={20} />
          </button>
          <button className="icon-btn" title="Settings">
            <Settings size={20} />
          </button>
          <div className="profile-menu">
            <button
              className="profile-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <User size={20} />
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
