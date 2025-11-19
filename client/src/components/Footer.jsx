import React from 'react';
import { Heart, Shield, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-12 px-4 pb-12">
      <div className="max-w-7xl mx-auto text-muted">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold gradient-text">About MediMirror</h4>
            <p className="text-sm mt-2">AI-assisted preliminary diagnostics. Not a substitute for professional medical advice.</p>
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <div className="mt-2 space-y-1">
              <a className="block text-sm text-muted">Privacy</a>
              <a className="block text-sm text-muted">Terms</a>
              <a className="block text-sm text-muted">Disclaimer</a>
            </div>
          </div>

          <div className="text-right">
            <h4 className="font-semibold text-white">Contact</h4>
            <div className="mt-2 text-sm text-muted">
              <div className="flex items-center justify-end gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@medimirror.com" className="text-muted">support@medimirror.com</a>
              </div>
              <div className="mt-2 flex items-center justify-end gap-2 text-xs">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Privacy focused</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-[var(--mm-border)] flex items-center justify-between text-sm text-muted">
          <div>© {currentYear} MediMirror. All rights reserved.</div>
          <div className="flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-400" /> for better healthcare
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
