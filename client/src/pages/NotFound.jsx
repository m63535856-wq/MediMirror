/**
 * 404 Not Found Page
 */

import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Header from '../components/Header';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl animate-scale-in">
          
          {/* 404 Number */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <h1 className="text-9xl font-bold gradient-text relative">
              404
            </h1>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="glass-card p-6 inline-block">
              <Search className="w-16 h-16 text-blue-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold mb-4 text-white">
            Page Not Found
          </h2>
          <p className="text-xl text-white/70 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-white/50 mb-4">Quick Links</p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <button
                onClick={() => navigate('/')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/body-map')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Body Map
              </button>
              <button
                onClick={() => navigate('/consultation')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Consultation
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default NotFound;