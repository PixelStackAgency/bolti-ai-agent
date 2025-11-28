const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  callId: { type: String, required: true },
  ticketId: { type: String, required: true, unique: true },
  
  // Ticket info
  title: { type: String, required: true },
  description: String,
  issue: String,
  
  // Customer
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  
  // Status
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed', 'pending'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  
  // Resolution
  assignedTo: String,
  resolution: String,
  resolutionTime: Number, // minutes
  
  // AI Classification
  category: String,
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
  intentDetected: String,
  
  // Metadata
  tags: [String],
  attachments: [String],
  
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
