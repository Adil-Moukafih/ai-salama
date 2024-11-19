'use client';

import LoginForm from '@/components/auth/LoginForm';
import ParticlesBackground from '@/components/shared/ParticlesBackground';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'] });

export default function LoginPage() {
  return (
    // Force dark theme for login page
    <div data-theme="dark" className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center min-h-screen justify-center">
        {/* Logo and Title */}
        <div className="text-center mb-10 login-animation">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center relative overflow-hidden">
                <i className="fas fa-shield-alt text-4xl text-white"></i>
                {/* Scanning Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent scanning-line"></div>
              </div>
              {/* Pulse Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
            </div>
          </div>
          <h1 className={`${orbitron.className} text-5xl font-bold text-white mb-4 tracking-wider`}>SALAMA</h1>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-blue-400 text-lg">Safety Assurance with Live AI Monitoring & Alerts</p>
            <p className="text-gray-400 italic">"Guarding Tomorrow's Railways, Today"</p>
          </div>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
