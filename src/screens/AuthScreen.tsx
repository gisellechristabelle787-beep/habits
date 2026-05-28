import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock } from 'lucide-react';

export function AuthScreen() {
  const { login } = useAppContext();

  const handleGoogleLogin = async () => {
    try {
      await login(); // We just trigger the google popup now
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-primary-container/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm glass-card rounded-[32px] p-8 shadow-warm flex flex-col items-center z-10 border-2 border-white/50"
      >
        <div className="w-28 h-28 rounded-full bg-primary-container/50 border-[6px] border-white overflow-hidden shadow-inner mb-6 relative">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtNIfqaL2wNDdWYO9k8S57g7zpuD5cl-PL4fnnPG4zvmUuYAQBLAxMRT0KWxLTHAddsdZY9mRAoW8ZXdK90ZrMzMd_OnV9ojohpO6wUJnfSRbubbPYzP1Ydv5hyxH2tZVCbdWQqf8c-FMe6C7CUn9ajDGiQSWmCHxLCLR2ulZoKAJqCuMd_YcYudi2ywaOOpGBuZ2ZUxw5YbAbGN1yqjjN_BfD7baIhdFd6KUvKGeSNJzJXScsMOdB5nI_8_NJaAkNcDdLU67PLzQ" 
            alt="Mascot" 
            className="w-full h-full object-cover"
          />
          <Sparkles className="absolute top-2 right-2 w-4 h-4 text-white animate-pulse" />
        </div>

        <h1 className="font-headline-xl text-[32px] font-bold tracking-tight text-primary mb-2 text-center leading-none">
          Pawgress
        </h1>
        <p className="font-body-sm text-[14px] text-on-surface-variant text-center mb-8">
          Welcome back! Your companion missed you.
        </p>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-primary text-on-primary font-bold rounded-2xl py-4 shadow-[0_4px_0_#6a383d] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-[14px] flex items-center justify-center gap-2"
        >
          <img src="https://res.cloudinary.com/dhbxrnxd5/image/upload/v1779959328/Screenshot_2026-05-28_at_11.23.05-removebg-preview_rcmzjb.png" alt="Google" className="w-6 h-6 bg-white rounded-full p-0.5 object-contain" />
          Continue with Google
        </button>

      </motion.div>
    </div>
  );
}
