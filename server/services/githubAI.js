/**
 * GitHub Models AI Service
 * Handles all interactions with GitHub's AI Models API
 * 
 * @module services/githubAI
 */

import axios from 'axios';

// GitHub Models API endpoint
const GITHUB_API_URL = 'https://models.inference.ai.azure.com/chat/completions';
const MODEL_NAME = 'gpt-4o';

/**
 * Validates GitHub token configuration
 * @throws {Error} If token is not configured
 */
const validateToken = () => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not configured in environment variables');
  }
};

/**
 * Send a chat message to GitHub Models API
 * 
 * @param {Array} messages - Array of message objects [{role, content}]
 * @param {string} systemPrompt - System prompt for AI context
 * @param {number} temperature - Randomness of responses (0-1)
 * @returns {Promise<string>} AI response text
 */
export const sendChatMessage = async (messages, systemPrompt = '', temperature = 0.7) => {
  validateToken();

  try {
    // Prepare messages with system prompt
    const formattedMessages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages
    ];

    // Make API request
    const response = await axios.post(
      GITHUB_API_URL,
      {
        model: MODEL_NAME,
        messages: formattedMessages,
        temperature: temperature,
        max_tokens: 2048,
        top_p: 0.9,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
        },
        timeout: parseInt(process.env.API_TIMEOUT) || 30000
      }
    );

    // Extract and return response
    const aiResponse = response.data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response received from AI');
    }

    return aiResponse;

  } catch (error) {
    // Handle specific error types
    if (error.response) {
      // API returned an error response
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.response.statusText;
      
      console.error('GitHub API Error:', {
        status,
        message,
        data: error.response.data
      });

      if (status === 401) {
        throw new Error('Invalid GitHub API token. Please check your configuration.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 500) {
        throw new Error('AI service is temporarily unavailable. Please try again.');
      } else {
        throw new Error(`AI service error: ${message}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from GitHub API:', error.message);
      throw new Error('Unable to reach AI service. Please check your connection.');
    } else {
      // Error in request setup
      console.error('Error setting up request:', error.message);
      throw new Error('Failed to process AI request.');
    }
  }
};

/**
 * Generate medical diagnosis using AI
 * 
 * @param {Array} conversationHistory - Full conversation history
 * @param {Array} bodyParts - Selected body parts
 * @returns {Promise<Object>} Structured diagnosis object
 */
export const generateDiagnosis = async (conversationHistory, bodyParts) => {
  validateToken();

  // Create comprehensive system prompt for diagnosis
  const systemPrompt = `You are an expert medical AI assistant specialized in differential diagnosis. Based on the patient's symptoms and conversation, provide a structured medical assessment.

IMPORTANT: You must respond ONLY with valid JSON. No preamble, no markdown, no explanation - just the JSON object.

Required JSON structure:
{
  "primaryDiagnosis": "Most likely condition name",
  "confidence": 85,
  "differentialDiagnoses": [
    {"condition": "Alternative diagnosis 1", "probability": 60},
    {"condition": "Alternative diagnosis 2", "probability": 40}
  ],
  "severity": "Mild|Moderate|Severe|Critical",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ],
  "redFlags": [
    "Warning sign 1 to watch for",
    "Warning sign 2 to watch for"
  ],
  "homeCare": [
    "Self-care instruction 1",
    "Self-care instruction 2"
  ],
  "followUp": "When to follow up (e.g., '24-48 hours', '1 week')",
  "seekImmediateCare": false
}

Consider: symptoms severity, duration, affected body parts: ${bodyParts.join(', ')}`;

  try {
    const response = await sendChatMessage(
      conversationHistory,
      systemPrompt,
      0.3 // Lower temperature for more consistent diagnosis
    );

    // Parse JSON response
    const cleanResponse = response.replace(/```json|```/g, '').trim();
    const diagnosis = JSON.parse(cleanResponse);

    // Validate required fields
    if (!diagnosis.primaryDiagnosis || !diagnosis.confidence) {
      throw new Error('Invalid diagnosis format received from AI');
    }

    return diagnosis;

  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Failed to parse diagnosis JSON:', error);
      throw new Error('Unable to generate structured diagnosis. Please try again.');
    }
    throw error;
  }
};

/**
 * Health check for GitHub API
 * Tests if the API is accessible and token is valid
 * 
 * @returns {Promise<boolean>} True if API is healthy
 */
export const healthCheck = async () => {
  try {
    validateToken();
    
    const response = await sendChatMessage(
      [{ role: 'user', content: 'Hello' }],
      'You are a helpful assistant. Respond with just "OK".',
      0
    );
    
    return response.toLowerCase().includes('ok');
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
};