import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedical } from '../context/MedicalContext';
import { ArrowRight, Brain, Activity, FileText, Shield, Zap, Users } from 'lucide-react';
import Disclaimer from '../components/Disclaimer';

const Home = () => {
  const navigate = useNavigate();
  const { startNewAssessment } = useMedical();

  const handleBeginAssessment = () => {
    startNewAssessment();
    navigate('/body-map');
  };

  const features = [
    { icon: Brain, title: 'AI-Powered Analysis', description: 'Advanced ML-driven symptom analysis', color: 'from-mm-500 to-accent-500', delay: 'animate-float-slow' },
    { icon: Activity, title: 'Interactive Body Map', description: 'Pinpoint symptoms with a touch-friendly anatomical map', color: 'from-purple-500 to-pink-400', delay: 'animate-float-slow' },
    { icon: FileText, title: 'Detailed Reports', description: 'Exportable, shareable diagnostic summaries', color: 'from-green-500 to-emerald-400', delay: 'animate-float-slow' },
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Users Assessed' },
    { icon: Zap, value: '95%', label: 'Accuracy Rate' },
    { icon: Shield, value: 'Secure', label: 'Privacy' }
  ];

  return (
    <main className="relative pt-28 pb-16 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12 animate-fade-in">
          <span className="badge badge-info">✨ AI-Powered Healthcare</span>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight">
            <span className="gradient-text">Your Personal</span><br />
            <span className="text-white">Medical Assistant</span>
          </h1>

          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Instant preliminary assessments — interactive, private, and powered by AI. Not a replacement for medical professionals.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleBeginAssessment} className="btn-primary">
              Begin Assessment <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-ghost"
            >
              Learn How It Works
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="glass-card text-center">
                  <Icon className="w-6 h-6 mx-auto mb-3 text-mm-500" />
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-sm text-muted mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        <Disclaimer className="mb-12 animate-slide-up" />

        <section id="how-it-works" className="mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-center gradient-text mb-4">How It Works</h2>
          <p className="text-center text-muted mb-8">Simple, secure, and adaptive diagnostic flow.</p>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="glass-card-hover">
                  <div className="icon-backdrop inline-block mb-4">
                    <Icon className="w-6 h-6 text-mm-500" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-muted text-sm">{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="text-center animate-scale-in">
          <div className="glass-card border-2 border-mm-500/20">
            <h3 className="text-2xl font-bold gradient-text">Ready to Get Started?</h3>
            <p className="text-muted mt-2 mb-6">Begin a 5-minute assessment to learn more.</p>
            <button onClick={handleBeginAssessment} className="btn-primary">
              Start Assessment <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
