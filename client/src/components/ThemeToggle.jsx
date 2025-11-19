import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass-card p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg"
      aria-label="Toggle theme"
      style={{ position: 'relative', zIndex: 50 }}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-400 animate-pulse" />
      ) : (
        <Moon className="w-6 h-6 text-blue-600" />
      )}
    </button>
  );
};

export default ThemeToggle;