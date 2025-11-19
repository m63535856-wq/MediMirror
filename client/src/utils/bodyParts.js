/**
 * Body Parts Data and Configuration
 * Defines all selectable body parts with coordinates and colors
 */

export const bodyParts = [
  {
    id: 'head',
    name: 'Head',
    color: '#3b82f6',
    hoverColor: '#60a5fa',
    category: 'upper'
  },
  {
    id: 'neck',
    name: 'Neck',
    color: '#3b82f6',
    hoverColor: '#60a5fa',
    category: 'upper'
  },
  {
    id: 'chest',
    name: 'Chest',
    color: '#06b6d4',
    hoverColor: '#22d3ee',
    category: 'upper'
  },
  {
    id: 'abdomen',
    name: 'Abdomen',
    color: '#06b6d4',
    hoverColor: '#22d3ee',
    category: 'core'
  },
  {
    id: 'back',
    name: 'Back',
    color: '#8b5cf6',
    hoverColor: '#a78bfa',
    category: 'core'
  },
  {
    id: 'left-shoulder',
    name: 'Left Shoulder',
    color: '#10b981',
    hoverColor: '#34d399',
    category: 'upper'
  },
  {
    id: 'right-shoulder',
    name: 'Right Shoulder',
    color: '#10b981',
    hoverColor: '#34d399',
    category: 'upper'
  },
  {
    id: 'left-arm',
    name: 'Left Arm',
    color: '#10b981',
    hoverColor: '#34d399',
    category: 'upper'
  },
  {
    id: 'right-arm',
    name: 'Right Arm',
    color: '#10b981',
    hoverColor: '#34d399',
    category: 'upper'
  },
  {
    id: 'left-hand',
    name: 'Left Hand',
    color: '#f59e0b',
    hoverColor: '#fbbf24',
    category: 'extremity'
  },
  {
    id: 'right-hand',
    name: 'Right Hand',
    color: '#f59e0b',
    hoverColor: '#fbbf24',
    category: 'extremity'
  },
  {
    id: 'left-leg',
    name: 'Left Leg',
    color: '#ef4444',
    hoverColor: '#f87171',
    category: 'lower'
  },
  {
    id: 'right-leg',
    name: 'Right Leg',
    color: '#ef4444',
    hoverColor: '#f87171',
    category: 'lower'
  },
  {
    id: 'left-foot',
    name: 'Left Foot',
    color: '#ec4899',
    hoverColor: '#f472b6',
    category: 'extremity'
  },
  {
    id: 'right-foot',
    name: 'Right Foot',
    color: '#ec4899',
    hoverColor: '#f472b6',
    category: 'extremity'
  }
];

/**
 * Get body part by ID
 * @param {string} id - Body part ID
 * @returns {Object|null} Body part object or null
 */
export const getBodyPartById = (id) => {
  return bodyParts.find(part => part.id === id) || null;
};

/**
 * Get body parts by category
 * @param {string} category - Category name
 * @returns {Array} Array of body parts in category
 */
export const getBodyPartsByCategory = (category) => {
  return bodyParts.filter(part => part.category === category);
};

/**
 * Validate body part selection
 * @param {string} id - Body part ID
 * @returns {boolean} True if valid
 */
export const isValidBodyPart = (id) => {
  return bodyParts.some(part => part.id === id);
};