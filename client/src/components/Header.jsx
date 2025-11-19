import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector'; 
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('header.home') },
    { path: '/body-map', label: t('header.assessment') },
    { path: '/quick-chat', label: t('header.quickChat') },
    { path: '/diagnosis', label: t('header.results') },
  ];

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row */}
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Activity className="w-8 h-8 text-mm-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold gradient-text">MediMirror</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-mm-500/20 text-mm-500'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <LanguageSelector />
            <ThemeToggle />
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass-card p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-mm-500/20 text-mm-500'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;
