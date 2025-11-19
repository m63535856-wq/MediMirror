import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Stethoscope, Loader2 } from 'lucide-react';

import { useMedical } from '../context/MedicalContext';
import { sendChatMessage, generateDiagnosis } from '../services/api';

import ChatMessage from '../components/ChatMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import VoiceInput from '../components/VoiceInput';
import { useLanguage } from '../context/LanguageContext';

const MAX_QUESTIONS = 6;
const MIN_QUESTIONS_FOR_DIAGNOSIS = 3;

const Consultation = () => {
  const navigate = useNavigate();
  const {
    selectedBodyParts,
    conversationHistory,
    addMessage,
    getFormattedConversation,
    overwriteConversation,
    setDiagnosis
  } = useMedical();

  const { t } = useLanguage();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initializedRef = useRef(false);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, isLoading]);

  /**
   * Start consultation (only once)
   */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (!selectedBodyParts || selectedBodyParts.length === 0) {
      navigate('/body-map');
      return;
    }

    if (conversationHistory.length === 0) {
      startConsultation();
    }
  }, []);

  /**
   * Start Consultation → FIRST BOT QUESTION
   */
  const startConsultation = async () => {
    setIsLoading(true);
    try {
      const bodyPartNames = selectedBodyParts
        .map(p => p.name ?? p)
        .join(', ');

      const userMsg = `I have symptoms in my ${bodyPartNames}.`;

      console.log('🚀 Starting consultation with body parts:', bodyPartNames);

      // Call API
      const res = await sendChatMessage(
        [{ role: 'user', content: userMsg }],
        `You are a medical assistant. Patient has symptoms in: ${bodyPartNames}. Ask one specific clinical question about their symptoms.`
      );

      console.log('📥 API Response:', res);

      // FIXED: Handle multiple response formats from backend
      const assistantText =
        res?.message ||           // Direct message field
        res?.data?.message ||     // Nested in data
        res?.response ||          // Alternative field name
        res?.data?.response ||    // Nested alternative
        'What symptoms are you experiencing exactly?'; // Fallback

      console.log('✅ Bot says:', assistantText);

      // Save to conversation history
      overwriteConversation([
        { role: 'user', content: userMsg, timestamp: new Date().toISOString() },
        { role: 'assistant', content: assistantText, timestamp: new Date().toISOString() }
      ]);

      setQuestionCount(1);
    } catch (err) {
      console.error('❌ Error starting consultation:', err);
      addMessage('assistant', '⚠️ Unable to start consultation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (text) => {
    setInput(prev => (prev ? `${prev} ${text}` : text));
    inputRef.current?.focus();
  };

  /**
   * SEND MESSAGE → GET NEXT QUESTION
   */
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    addMessage('user', userMsg);
    setInput('');
    inputRef.current?.focus();
    setIsLoading(true);

    try {
      const formatted = getFormattedConversation();
      formatted.push({ role: 'user', content: userMsg });

      console.log('📤 Sending message:', userMsg);

      const res = await sendChatMessage(
        formatted,
        `You are conducting a medical interview. You have asked ${questionCount} questions. Ask the next relevant follow-up question.`
      );

      console.log('📥 Response:', res);

      // FIXED: Handle multiple response formats
      const assistantText =
        res?.message ||
        res?.data?.message ||
        res?.response ||
        res?.data?.response ||
        'Can you explain that a bit more?';

      console.log('✅ Bot says:', assistantText);

      addMessage('assistant', assistantText);
      setQuestionCount(prev => prev + 1);

      // Auto-generate report after max questions
      if (questionCount + 1 >= MAX_QUESTIONS) {
        setTimeout(() => generateReport(), 500);
      }
    } catch (err) {
      console.error('❌ Error sending message:', err);
      addMessage('assistant', '⚠️ Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * GENERATE FINAL MEDICAL REPORT
   */
  const generateReport = async () => {
    if (conversationHistory.length < MIN_QUESTIONS_FOR_DIAGNOSIS * 2) {
      console.warn('⚠️ Not enough questions for diagnosis');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🏥 Generating diagnosis...');

      const formatted = getFormattedConversation();
      const res = await generateDiagnosis(
        formatted,
        selectedBodyParts.map(p => p.name ?? p)
      );

      console.log('📋 Diagnosis response:', res);

      const diagData = res?.data ?? res;

      if (diagData) {
        setDiagnosis(diagData);
        navigate('/diagnosis');
      } else {
        throw new Error('No diagnosis data received');
      }
    } catch (err) {
      console.error('❌ Error generating diagnosis:', err);
      addMessage('assistant', '⚠️ Unable to generate diagnosis. Try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-mm-500/20 rounded-full mb-4">
            <Stethoscope className="w-8 h-8 text-mm-500" />
          </div>

          <h1 className="text-4xl font-bold gradient-text mb-2">
            {t('consultation.title')}
          </h1>
          <p className="text-gray-400">{t('consultation.subtitle')}</p>
        </div>

        {/* Selected areas */}
        <div className="glass-card rounded-xl p-4 mb-6 animate-slide-up">
          <p className="text-sm text-gray-400 mb-2">{t('consultation.affectedAreas')}</p>
          <div className="flex flex-wrap gap-2">
            {selectedBodyParts.map((part, i) => (
              <span key={i} className="badge-info">{part.name ?? part}</span>
            ))}
          </div>
        </div>

        {/* Chat box */}
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up">
          <div className="h-96 overflow-y-auto mb-6 space-y-4 scrollbar-thin">
            {conversationHistory.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-mm-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('consultation.aiThinking')}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('consultation.placeholder')}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-mm-500 transition-colors"
              disabled={isLoading || isGenerating}
            />

            <VoiceInput onTranscript={handleVoiceTranscript} />

            <button
              type="submit"
              disabled={!input.trim() || isLoading || isGenerating}
              className="btn-primary px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {questionCount >= MIN_QUESTIONS_FOR_DIAGNOSIS && !isGenerating && (
            <button onClick={generateReport} className="w-full mt-4 btn-primary py-3 rounded-lg">
              {t('consultation.generateReport')}
            </button>
          )}
        </div>
      </div>

      {isGenerating && <LoadingSpinner fullScreen text={t('consultation.generating')} />}
    </div>
  );
};

export default Consultation;