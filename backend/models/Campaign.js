const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  campaignId: { type: String, required: true, unique: true },
  
  // Campaign info
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['sales', 'support', 'survey'], default: 'sales' },
  
  // Target
  targetFile: String, // CSV/Excel file path
  totalLeads: Number,
  processedLeads: { type: Number, default: 0 },
  
  // Status
  status: { type: String, enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'failed'], default: 'draft' },
  
  // Timing
  startDate: Date,
  endDate: Date,
  
  // Results
  callsInitiated: { type: Number, default: 0 },
  callsCompleted: { type: Number, default: 0 },
  leadsGenerated: { type: Number, default: 0 },
  conversionRate: Number,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
