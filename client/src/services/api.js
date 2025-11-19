/**
 * API Service
 * Handles all HTTP requests to the backend
 */

import axios from 'axios';

// Configure API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      if (status === 429) {
        error.message = 'Too many requests. Please wait a moment and try again.';
      } else if (status === 503) {
        error.message = 'Service temporarily unavailable. Please try again later.';
      } else if (data?.error) {
        error.message = data.error;
      }
    } else if (error.request) {
      // Request made but no response
      error.message = 'Unable to connect to server. Please check your internet connection.';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Send chat message to AI
 * @param {Array} messages - Conversation messages
 * @param {string} systemPrompt - System instructions
 * @param {string} conversationId - Conversation identifier
 * @returns {Promise<Object>} AI response
 */
export const sendChatMessage = async (messages, systemPrompt = '', conversationId = null) => {
  try {
    const response = await api.post('/chat', {
      messages,
      systemPrompt,
      conversationId: conversationId || Date.now().toString()
    });
    
    return response.data;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};

/**
 * Generate medical diagnosis
 * @param {Array} conversationHistory - Full conversation
 * @param {Array} bodyParts - Selected body parts
 * @returns {Promise<Object>} Diagnosis data
 */
export const generateDiagnosis = async (conversationHistory, bodyParts) => {
  try {
    const response = await api.post('/diagnosis', {
      conversationHistory,
      bodyParts
    });
    
    return response.data;
  } catch (error) {
    console.error('Diagnosis API Error:', error);
    throw error;
  }
};

/**
 * Check API health status
 * @returns {Promise<boolean>} True if healthy
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data.success === true;
  } catch (error) {
    console.error('Health Check Failed:', error);
    return false;
  }
};

/**
 * Test backend connectivity
 * @returns {Promise<Object>} Connection status
 */
export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return {
      connected: true,
      data: response.data
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};

export default api;