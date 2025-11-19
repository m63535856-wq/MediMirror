import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, RotateCcw, MessageSquare, Loader2 } from 'lucide-react';

import { useMedical } from '../context/MedicalContext';
import { sendChatMessage, generateDiagnosis } from '../services/api';

import ChatMessage from '../components/ChatMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import VoiceInput from '../components/VoiceInput';
import { useLanguage } from '../context/LanguageContext';

const QuickChat = () => {
  const navigate = useNavigate();
  const {
    conversationHistory,
    addMessage,
    getFormattedConversation,
    startNewAssessment,
    setDiagnosis
  } = useMedical();

  const { t } = useLanguage();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const initializedRef = useRef(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, isLoading]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (conversationHistory.length === 0) {
      startChat();
    }
  }, []);

  const startChat = async () => {
    setIsLoading(true);
    try {
      const systemPrompt = `You are a medical assistant. Start with a warm greeting in 1–2 sentences and ask the user about their main symptom. Be simple, empathetic, and clear.`;

      console.log('🚀 Starting Quick Chat...');

      const response = await sendChatMessage(
        [{ role: "user", content: "I want to discuss my health concerns." }],
        systemPrompt
      );

      console.log('📥 API Response:', response);

      // FIXED: Handle all response formats
      const assistantText = 
        response?.message ||
        response?.data?.message ||
        response?.response ||
        response?.data?.response ||
        "Hello! How can I assist you today?";

      console.log('✅ Bot says:', assistantText);

      addMessage("assistant", assistantText);
    } catch (err) {
      console.error('❌ Error starting chat:', err);
      addMessage("assistant", "⚠️ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    addMessage("user", userText);
    setIsLoading(true);

    try {
      const formatted = getFormattedConversation();
      formatted.push({ role: "user", content: userText });

      const systemPrompt = `You are conducting a short medical consultation. Ask only one follow-up question. Keep replies under 3 sentences. Stay empathetic and focused.`;

      console.log('📤 Sending message:', userText);

      const response = await sendChatMessage(formatted, systemPrompt);

      console.log('📥 Response:', response);

      // FIXED: Handle all response formats
      const assistantText = 
        response?.message ||
        response?.data?.message ||
        response?.response ||
        response?.data?.response ||
        "I'm here and listening.";

      console.log('✅ Bot says:', assistantText);

      addMessage("assistant", assistantText);
    } catch (err) {
      console.error('❌ Error sending message:', err);
      addMessage("assistant", "⚠️ Unable to process your message.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (text) => {
    console.log('🎤 Voice transcript:', text);
    setInput(prev => prev ? `${prev} ${text}` : text);
    inputRef.current?.focus();
  };

  const handleGenerateReport = async () => {
    if (conversationHistory.length < 4) {
      console.warn('⚠️ Need at least 4 messages for diagnosis');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🏥 Generating diagnosis...');

      const formatted = getFormattedConversation();
      const res = await generateDiagnosis(formatted, ['General symptoms']);

      console.log('📋 Diagnosis response:', res);

      const diag = res?.data ?? res;
      if (diag) {
        setDiagnosis(diag);
        navigate('/diagnosis');
      }
    } catch (err) {
      console.error('❌ Error generating diagnosis:', err);
      addMessage("assistant", "⚠️ Unable to generate diagnosis.");
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => {
    startNewAssessment();
    initializedRef.current = false;
    window.location.reload();
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-mm-500/20 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-mm-500" />
          </div>

          <h1 className="text-4xl font-bold gradient-text mb-2">{t('quickChat.title')}</h1>
          <p className="text-gray-400">{t('quickChat.subtitle')}</p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up">
          <div className="h-96 overflow-y-auto space-y-4 mb-6 scrollbar-thin scrollbar-thumb-mm-500/50 scrollbar-track-transparent">
            {conversationHistory.length === 0 && !isLoading && (
              <div className="flex justify-center items-center h-full text-gray-400">
                {t('quickChat.subtitle')}
              </div>
            )}

            {conversationHistory.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-mm-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('quickChat.aiThinking')}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('quickChat.placeholder')}
                disabled={isLoading || isGenerating}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-mm-500 transition-colors"
              />

              <VoiceInput onTranscript={handleVoiceTranscript} />

              <button 
                type="submit" 
                disabled={!input.trim() || isLoading || isGenerating} 
                className="btn-primary px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={handleGenerateReport} 
                disabled={conversationHistory.length < 4 || isLoading || isGenerating} 
                className="flex-1 btn-primary py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('common.loading')}
                  </span>
                ) : (
                  t('quickChat.generateReport')
                )}
              </button>

              <button 
                type="button" 
                onClick={handleStartOver} 
                disabled={isLoading || isGenerating} 
                className="glass-card px-6 py-3 rounded-lg hover:bg-white/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5" />
                {t('quickChat.startOver')}
              </button>
            </div>
          </form>
        </div>

        <div className="glass-card rounded-xl p-4 text-sm text-gray-400 animate-fade-in">
          💡 {t('quickChat.conversationLength')}
        </div>
      </div>
    </div>
  );
};

export default QuickChat;