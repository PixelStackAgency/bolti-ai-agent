const pdfParse = require('pdf-parse');
const cheerio = require('cheerio');
const axios = require('axios');
const KnowledgeBase = require('../models/KnowledgeBase');
const { v4: uuidv4 } = require('uuid');

/**
 * Simple chunking strategy - split by sentences/paragraphs
 */
function chunkText(text, chunkSize = 500) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Generate simple embeddings (mock - use sentence-transformers in production)
 */
function generateEmbedding(text) {
  // In production, use sentence-transformers or similar
  // For now, create a simple hash-based mock embedding
  const hash = require('crypto').createHash('sha256').update(text).digest('hex');
  const embedding = [];
  for (let i = 0; i < 768; i++) { // Standard embedding size
    embedding.push(
      parseInt(hash.substring((i * 2) % hash.length, (i * 2 + 2) % hash.length), 16) / 255
    );
  }
  return embedding;
}

/**
 * Process PDF file
 */
exports.processPDF = async (filePath, fileName) => {
  try {
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    const chunks = chunkText(text, 500);

    return chunks.map((chunk, idx) => ({
      chunkId: `chunk_${uuidv4().substring(0, 8)}`,
      content: chunk,
      embedding: generateEmbedding(chunk),
      pageNumber: Math.floor(idx / 5) + 1 // Rough estimate
    }));
  } catch (error) {
    console.error('PDF processing error:', error);
    throw error;
  }
};

/**
 * Scrape URL and extract text
 */
exports.scrapeURL = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script').remove();
    $('style').remove();

    const text = $('body').text();
    const cleanText = text.replace(/\s+/g, ' ').trim();

    const chunks = chunkText(cleanText, 500);

    return chunks.map((chunk, idx) => ({
      chunkId: `chunk_${uuidv4().substring(0, 8)}`,
      content: chunk,
      embedding: generateEmbedding(chunk),
      source: url
    }));
  } catch (error) {
    console.error('URL scraping error:', error);
    throw error;
  }
};

/**
 * Create knowledge base from file/URL
 */
exports.createKnowledgeBase = async (tenantId, fileName, fileType, content, fileUrl = null) => {
  try {
    let chunks = [];

    if (fileType === 'pdf') {
      chunks = await exports.processPDF(content, fileName);
    } else if (fileType === 'url') {
      chunks = await exports.scrapeURL(content);
    } else if (fileType === 'text') {
      chunks = chunkText(content, 500).map((chunk, idx) => ({
        chunkId: `chunk_${uuidv4().substring(0, 8)}`,
        content: chunk,
        embedding: generateEmbedding(chunk)
      }));
    }

    const kbId = `kb_${uuidv4().substring(0, 12)}`;

    const kb = new KnowledgeBase({
      tenantId,
      kbId,
      fileName,
      fileType,
      fileUrl: fileUrl || content,
      chunks,
      processingStatus: 'completed',
      totalChunks: chunks.length,
      totalTokens: chunks.reduce((sum, c) => sum + c.content.split(' ').length, 0)
    });

    await kb.save();

    return kb;
  } catch (error) {
    console.error('KB creation error:', error);
    throw error;
  }
};

/**
 * Semantic search in knowledge base
 */
exports.semanticSearch = async (tenantId, query, topK = 5) => {
  try {
    const queryEmbedding = generateEmbedding(query);

    // Get all KB entries for tenant
    const kbEntries = await KnowledgeBase.find({
      tenantId,
      processingStatus: 'completed'
    });

    // Calculate similarity scores
    const results = [];

    for (const kb of kbEntries) {
      for (const chunk of kb.chunks) {
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
        results.push({
          kbId: kb.kbId,
          fileName: kb.fileName,
          content: chunk.content,
          similarity,
          source: kb.fileUrl
        });
      }
    }

    // Sort by similarity and return top K
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  } catch (error) {
    console.error('Semantic search error:', error);
    return [];
  }
};

/**
 * Cosine similarity between embeddings
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (normA * normB);
}

module.exports = exports;
