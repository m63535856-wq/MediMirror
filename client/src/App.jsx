import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { MedicalProvider } from './context/MedicalContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import Header from './components/Header';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

// Pages
import Home from './pages/Home';
import BodyMap from './pages/BodyMap';
import QuickChat from './pages/QuickChat';
import Diagnosis from './pages/Diagnosis';
import Consultation from './pages/Consultation';
import NotFound from './pages/NotFound';

import './index.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MedicalProvider>

          <Router>
            <div className="min-h-screen app-bg text-white flex flex-col">

              {/* HEADER */}
              <Header />

              {/* THEME TOGGLE (Dark Cyan / Navy) */}
              <div className="fixed bottom-5 right-5 z-50">
                <ThemeToggle />
              </div>

              {/* MAIN ROUTES */}
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/body-map" element={<BodyMap />} />
                  <Route path="/quick-chat" element={<QuickChat />} />
                  <Route path="/diagnosis" element={<Diagnosis />} />
                  <Route path="/consultation" element={<Consultation />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* FOOTER */}
              <Footer />
            </div>
          </Router>

        </MedicalProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
