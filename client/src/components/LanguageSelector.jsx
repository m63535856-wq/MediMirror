import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useRef, useEffect } from 'react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card px-3 py-2 rounded-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
        aria-label="Select language"
      >
        <Globe className="w-5 h-5 text-mm-500" />
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-xl border border-white/10 overflow-hidden animate-fade-in z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                language === lang.code
                  ? 'bg-mm-500/20 text-mm-500'
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;