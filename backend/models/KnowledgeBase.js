const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  kbId: { type: String, required: true, unique: true },
  
  // File info
  fileName: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'url', 'text'], required: true },
  fileUrl: String,
  textContent: String,
  
  // Processing
  chunks: [{
    chunkId: String,
    content: String,
    embedding: [Number], // Store embedding vector
    pageNumber: Number,
    metadata: {}
  }],
  
  // Status
  processingStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  embeddingModel: { type: String, default: 'sentence-transformers' },
  
  // Statistics
  totalChunks: Number,
  totalTokens: Number,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
