import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function KnowledgeBasePage() {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);
  const [uploadType, setUploadType] = useState('pdf');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.post('/kb/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSources([...sources, response.data]);
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed: ' + error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleURLAdd = async (url) => {
    if (!url.trim()) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.post('/kb/add-url', { url });
      setSources([...sources, response.data]);
      setMessage({ type: 'success', text: 'URL added successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add URL: ' + error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Knowledge Base Manager</h1>
          <p>Upload PDFs, URLs, and text to power your AI</p>
        </div>

        {message && (
          <div className={`message-banner ${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        <div className="kb-upload-section">
          <div className="upload-options">
            <div className="upload-card">
              <div className="upload-icon">
                <FileText size={32} />
              </div>
              <h3>Upload PDF</h3>
              <p>Add product catalogs, policies, or manuals</p>
              <label className="upload-button">
                <Upload size={18} />
                Choose File
                <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} hidden />
              </label>
            </div>

            <div className="upload-card">
              <div className="upload-icon">
                <Globe size={32} />
              </div>
              <h3>Add Website URL</h3>
              <p>Scrape and index your website content</p>
              <input
                type="url"
                placeholder="https://example.com"
                className="url-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleURLAdd(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            <div className="upload-card">
              <div className="upload-icon">
                <FileText size={32} />
              </div>
              <h3>Direct Text</h3>
              <p>Paste pricing, FAQs, or policies</p>
              <textarea
                placeholder="Paste your content here..."
                className="text-input"
                rows="4"
              />
            </div>
          </div>
        </div>

        <div className="kb-sources-section">
          <h2>Your Knowledge Sources</h2>
          
          {sources.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <p>No knowledge sources yet</p>
              <small>Upload PDFs, URLs, or paste text above to get started</small>
            </div>
          ) : (
            <table className="sources-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Chunks</th>
                  <th>Tokens</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.kbId}>
                    <td>{source.fileName}</td>
                    <td>{source.fileType.toUpperCase()}</td>
                    <td>{source.totalChunks}</td>
                    <td>{source.totalTokens?.toLocaleString()}</td>
                    <td><span className={`status ${source.processingStatus}`}>{source.processingStatus}</span></td>
                    <td>{new Date(source.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="kb-tips">
          <h3>📝 Best Practices</h3>
          <ul>
            <li>Keep content concise and well-organized</li>
            <li>Use clear pricing and product information</li>
            <li>Include FAQs and common objections</li>
            <li>Add company policies and terms</li>
            <li>Regular updates improve AI responses</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
