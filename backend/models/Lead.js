const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  callId: { type: String, required: true },
  
  // Lead info
  name: { type: String },
  phone: { type: String, required: true },
  email: String,
  company: String,
  
  // Query & Resolution
  query: String,
  transcriptSummary: String,
  resolvedByAI: Boolean,
  escalatedToHuman: Boolean,
  humanResponse: String,
  
  // Status
  status: { type: String, enum: ['new', 'contacted', 'converted', 'lost', 'pending'], default: 'new' },
  
  // Metadata
  source: { type: String, default: 'inbound_call' }, // inbound_call, campaign, whatsapp, sms
  campaign: String,
  tags: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
