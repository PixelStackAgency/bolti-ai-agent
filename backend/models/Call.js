const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  callId: { type: String, required: true, unique: true },
  exotelCallId: String,
  
  // Call info
  type: { type: String, enum: ['inbound', 'outbound'], required: true },
  fromNumber: { type: String, required: true },
  toNumber: { type: String, required: true },
  callerLanguage: { type: String, default: 'en' },
  
  // AI interaction
  status: { type: String, enum: ['initiated', 'active', 'completed', 'failed', 'escalated'], default: 'initiated' },
  aiTranscript: String,
  aiSentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
  resolvedByAI: { type: Boolean, default: false },
  
  // Escalation
  escalated: { type: Boolean, default: false },
  escalationNumber: String,
  escalationDuration: Number,
  humanNotes: String,
  
  // Recording
  recordingUrl: String,
  recordingDuration: Number,
  
  // Metadata
  leadData: {
    name: String,
    phone: String,
    email: String,
    query: String
  },
  
  duration: { type: Number, default: 0 }, // seconds
  costMinutes: { type: Number, default: 0 },
  
  // Timestamps
  startTime: Date,
  endTime: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Call', callSchema);
