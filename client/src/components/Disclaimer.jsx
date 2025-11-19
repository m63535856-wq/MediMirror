/**
 * Disclaimer Component
 * Medical disclaimer notice
 */

import { AlertTriangle, Shield } from 'lucide-react';

const Disclaimer = ({ className = '' }) => {
  return (
    <div className={`glass-card border-amber-400/30 bg-amber-500/10 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-lg"></div>
            <Shield className="w-8 h-8 text-amber-400 relative" strokeWidth={2} />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-amber-300">
              Important Medical Disclaimer
            </h3>
          </div>
          
          <div className="space-y-2 text-sm text-white/80">
            <p>
              <strong className="text-amber-300">This is NOT a substitute for professional medical advice.</strong> 
              {' '}MediMirror is an AI-powered tool designed to provide general health information only.
            </p>
            
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li>Always consult qualified healthcare professionals for medical concerns</li>
              <li>In emergencies, call your local emergency number immediately</li>
              <li>AI-generated diagnoses may not be accurate or complete</li>
              <li>Your use of this tool does not create a doctor-patient relationship</li>
            </ul>
            
            <p className="text-amber-300/90 font-medium mt-3">
              🚨 Seek immediate medical attention if you experience severe symptoms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;