/**
 * Medical Context
 * Global state management for medical assessment flow
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const MedicalContext = createContext();

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within MedicalProvider');
  }
  return context;
};

export const MedicalProvider = ({ children }) => {
  // Selected body parts
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);

  // Conversation history (array of { role, content, timestamp })
  const [conversationHistory, setConversationHistory] = useState([]);

  // Current diagnosis data
  const [diagnosisData, setDiagnosisData] = useState(null);

  // Assessment metadata
  const [assessmentId, setAssessmentId] = useState(null);
  const [startTime, setStartTime] = useState(null);

  /**
   * Add body part to selection (avoid duplicates)
   */
  const addBodyPart = useCallback((bodyPart) => {
    setSelectedBodyParts(prev => {
      if (prev?.find(p => p.id === bodyPart.id)) return prev;
      return [...(prev || []), bodyPart];
    });
  }, []);

  /**
   * Remove body part
   */
  const removeBodyPart = useCallback((bodyPartId) => {
    setSelectedBodyParts(prev => (prev || []).filter(p => p.id !== bodyPartId));
  }, []);

  /**
   * Clear body parts
   */
  const clearBodyParts = useCallback(() => {
    setSelectedBodyParts([]);
  }, []);

  /**
   * Add message to conversation history
   */
  const addMessage = useCallback((role, content) => {
    const message = {
      role,
      content,
      timestamp: new Date().toISOString()
    };
    setConversationHistory(prev => [...prev, message]);
  }, []);

  /**
   * Overwrite conversation
   */
  const overwriteConversation = useCallback((messagesArray) => {
    const normalized = messagesArray.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp || new Date().toISOString()
    }));
    setConversationHistory(normalized);
  }, []);

  /**
   * Clear conversation
   */
  const clearConversation = useCallback(() => {
    setConversationHistory([]);
  }, []);

  /**
   * Set diagnosis results
   */
  const setDiagnosis = useCallback((data) => {
    setDiagnosisData(data);
  }, []);

  /**
   * Start new assessment (DO NOT CLEAR BODY PARTS)
   */
  const startNewAssessment = useCallback(() => {
    const newId = Date.now().toString();
    setAssessmentId(newId);
    setStartTime(new Date().toISOString());
    setConversationHistory([]);
    setDiagnosisData(null);
    // ❌ Removed: setSelectedBodyParts([])
  }, []);

  /**
   * Reset everything
   */
  const resetAll = useCallback(() => {
    setSelectedBodyParts([]);
    setConversationHistory([]);
    setDiagnosisData(null);
    setAssessmentId(null);
    setStartTime(null);
  }, []);

  /**
   * Format conversation for API
   */
  const getFormattedConversation = useCallback(() => {
    return conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }, [conversationHistory]);

  /**
   * Assessment duration (minutes)
   */
  const getAssessmentDuration = useCallback(() => {
    if (!startTime) return null;
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  }, [startTime]);

  const value = {
    // State
    selectedBodyParts: selectedBodyParts || [],
    conversationHistory,
    diagnosisData,
    assessmentId,
    startTime,

    // Expose setter fully (important for restoring state)
    setSelectedBodyParts,

    // Body part actions
    addBodyPart,
    removeBodyPart,
    clearBodyParts,

    // Conversation actions
    addMessage,
    overwriteConversation,
    clearConversation,
    getFormattedConversation,
    setConversationHistory,

    // Diagnosis actions
    setDiagnosis,

    // Assessment actions
    startNewAssessment,
    resetAll,
    getAssessmentDuration,

    // Computed flags
    hasBodyParts: (selectedBodyParts || []).length > 0,
    hasConversation: conversationHistory.length > 0,
    hasDiagnosis: diagnosisData !== null,
    messageCount: conversationHistory.length,
  };

  return (
    <MedicalContext.Provider value={value}>
      {children}
    </MedicalContext.Provider>
  );
};
