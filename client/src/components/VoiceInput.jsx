import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const VoiceInput = ({ onTranscript, className = '' }) => {
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useVoiceInput();
  const { language } = useLanguage();

  // Map language codes to speech recognition language codes
  const getLangCode = (lang) => {
    const langMap = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      hi: 'hi-IN',
    };
    return langMap[lang] || 'en-US';
  };

  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onTranscript, resetTranscript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(getLangCode(language));
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Voice input not supported</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleToggleListening}
        className={`p-3 rounded-lg transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'glass-card hover:bg-mm-500/20'
        }`}
        aria-label={isListening ? 'Stop recording' : 'Start recording'}
      >
        {isListening ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-mm-500" />
        )}
      </button>
      
      {isListening && (
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-mm-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-4 bg-mm-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-4 bg-mm-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-mm-500">Listening...</span>
        </div>
      )}
      
      {transcript && !isListening && (
        <div className="text-sm text-gray-400 max-w-xs truncate animate-fade-in">
          {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;