/**
 * Validation Utilities
 * Input validation and sanitization functions
 */

const MAX_MESSAGE_LENGTH = 1000;
const MIN_MESSAGE_LENGTH = 1;

/**
 * Validate message input
 * @param {string} message - User message
 * @returns {Object} Validation result {isValid, error}
 */
export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return {
      isValid: false,
      error: 'Message is required'
    };
  }

  const trimmed = message.trim();

  if (trimmed.length < MIN_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: 'Message is too short'
    };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Sanitize user input
 * Removes potentially harmful characters
 * @param {string} input - Raw input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframes
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

/**
 * Validate body parts selection
 * @param {Array} bodyParts - Selected body parts
 * @returns {Object} Validation result
 */
export const validateBodyParts = (bodyParts) => {
  if (!Array.isArray(bodyParts)) {
    return {
      isValid: false,
      error: 'Body parts must be an array'
    };
  }

  if (bodyParts.length === 0) {
    return {
      isValid: false,
      error: 'Please select at least one body part'
    };
  }

  if (bodyParts.length > 10) {
    return {
      isValid: false,
      error: 'Maximum 10 body parts can be selected'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Format error message for display
 * @param {string|Error} error - Error object or message
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Validate conversation history
 * @param {Array} history - Conversation messages
 * @returns {boolean} True if valid
 */
export const validateConversationHistory = (history) => {
  if (!Array.isArray(history)) return false;
  if (history.length === 0) return false;
  
  return history.every(msg => 
    msg && 
    typeof msg === 'object' && 
    msg.role && 
    msg.content &&
    ['user', 'assistant'].includes(msg.role)
  );
};