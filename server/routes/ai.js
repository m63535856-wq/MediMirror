/**
 * AI Routes
 * Handles all AI-related API endpoints
 * 
 * @module routes/ai
 */

import express from 'express';
import { sendChatMessage, generateDiagnosis, healthCheck } from '../services/githubAI.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { aiLimiter, diagnosisLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Maximum message length for validation
const MAX_MESSAGE_LENGTH = parseInt(process.env.MAX_MESSAGE_LENGTH) || 1000;

/**
 * Validate chat request body
 */
const validateChatRequest = (req, res, next) => {
  const { messages, systemPrompt } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Messages array is required and must not be empty'
    });
  }

  // Validate each message
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return res.status(400).json({
        success: false,
        error: 'Each message must have role and content'
      });
    }

    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Message content exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`
      });
    }
  }

  // Validate system prompt if provided
  if (systemPrompt && typeof systemPrompt !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'System prompt must be a string'
    });
  }

  next();
};

/**
 * Validate diagnosis request body
 * UPDATED: bodyParts is now optional for Quick Chat
 */
const validateDiagnosisRequest = (req, res, next) => {
  const { conversationHistory, bodyParts } = req.body;

  if (!conversationHistory || !Array.isArray(conversationHistory)) {
    return res.status(400).json({
      success: false,
      error: 'Conversation history is required and must be an array'
    });
  }

  // Body parts is now OPTIONAL (for Quick Chat)
  if (bodyParts && !Array.isArray(bodyParts)) {
    return res.status(400).json({
      success: false,
      error: 'Body parts must be an array if provided'
    });
  }

  if (conversationHistory.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'At least 2 conversation exchanges are required for diagnosis'
    });
  }

  next();
};

/**
 * POST /api/chat
 * Send a chat message and get AI response
 */
router.post('/chat', aiLimiter, validateChatRequest, asyncHandler(async (req, res) => {
  const { messages, systemPrompt, conversationId } = req.body;

  console.log(`Processing chat request - Conversation ID: ${conversationId || 'new'}`);

  const response = await sendChatMessage(messages, systemPrompt);

  res.json({
    success: true,
    data: {
      response,
      conversationId: conversationId || Date.now().toString(),
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * POST /api/diagnosis
 * Generate comprehensive medical diagnosis
 * UPDATED: Supports both body map and quick chat modes
 */
router.post('/diagnosis', diagnosisLimiter, validateDiagnosisRequest, asyncHandler(async (req, res) => {
  const { conversationHistory, bodyParts } = req.body;

  // Use provided body parts or default to "General symptoms" for Quick Chat
  const affectedAreas = bodyParts && bodyParts.length > 0 
    ? bodyParts 
    : ['General symptoms'];

  console.log(`Generating diagnosis for: ${affectedAreas.join(', ')}`);

  const diagnosis = await generateDiagnosis(conversationHistory, affectedAreas);

  res.json({
    success: true,
    data: {
      ...diagnosis,
      timestamp: new Date().toISOString(),
      bodyParts: affectedAreas
    }
  });
}));

/**
 * GET /api/health
 * Check if AI service is available
 */
router.get('/health', asyncHandler(async (req, res) => {
  const isHealthy = await healthCheck();

  if (isHealthy) {
    res.json({
      success: true,
      status: 'healthy',
      message: 'AI service is operational',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'AI service is not responding',
      timestamp: new Date().toISOString()
    });
  }
}));

export default router;