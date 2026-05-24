import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, ArrowRight, Lock, User, X, Sparkles } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-2 text-white">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, error } = useAuthStore();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      if (isLoginMode) {
        const user = await login(email, password);
        if (user.role === 'Admin' && redirect === '/') navigate('/admin');
        else navigate(redirect);
      } else {
        await register(name, email, password);
        navigate(redirect);
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans relative">
      
      {/* Noise filter */}
      <div className="noise-overlay" />

      {/* ── LEFT PANEL – fashion image ── */}
      <div 
        className="hidden lg:flex flex-[1_1_55%] relative bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-[var(--theme-bg)] pointer-events-none" />
        <div className="absolute bottom-16 left-16 z-10 space-y-3 font-mono">
          <div className="w-8 h-[1px] bg-[#7C3AED]" />
          <h2 className="text-3xl font-black tracking-tighter uppercase font-display text-white">
            VASTRR STUDIOS.
          </h2>
          <p className="text-[10px] tracking-[0.25em] text-[var(--theme-grey)] uppercase">
            EST. 2026 // SYSTEM TERMINAL
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL – form ── */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 lg:flex-[0_0_460px] bg-[#0A0A0A] border-l border-[var(--theme-border)] flex items-center justify-center p-8 md:p-12 relative z-10 shadow-[20px_0_50px_rgba(0,0,0,0.9)]"
      >
        {/* close button */}
        <Link 
          to="/" 
          className="absolute top-8 right-8 w-8 h-8 rounded-none border border-[var(--theme-border)] hover:border-white/20 bg-[var(--theme-card)] flex items-center justify-center text-[var(--theme-grey)] hover:text-[var(--theme-text)] transition-all duration-200"
        >
          <X size={14} />
        </Link>

        <div className="w-full max-w-sm space-y-8 font-mono">
          
          {/* Label and Heading */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold tracking-[0.3em] text-[#7C3AED] uppercase block">
              {isLoginMode ? 'EXISTING MEMBER' : 'NEW MEMBER'}
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-display">
              {isLoginMode ? 'Welcome Back.' : 'Create Account.'}
            </h2>
          </div>

          {/* error box */}
          <AnimatePresence>
            {(error || localError) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-900/10 border border-red-500/20 text-red-400 text-[10px] font-medium p-4 rounded-none overflow-hidden uppercase tracking-wider"
              >
                {error || localError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name field (register only) */}
            <AnimatePresence>
              {!isLoginMode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative w-full">
                    <User size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                    <input 
                      type="text"
                      required={!isLoginMode}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="FULL NAME"
                      className="w-full bg-[#111] border border-[var(--theme-border)] hover:border-white/15 focus:border-[#7C3AED] focus:ring-0 outline-none px-12 py-3.5 text-xs text-white uppercase tracking-wider transition-colors placeholder:text-[#444]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="relative w-full">
              <Mail size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full bg-[#111] border border-[var(--theme-border)] hover:border-white/15 focus:border-[#7C3AED] focus:ring-0 outline-none px-12 py-3.5 text-xs text-white uppercase tracking-wider transition-colors placeholder:text-[#444]"
              />
            </div>

            {/* Password Field */}
            <div className="relative w-full">
              <Lock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-[#111] border border-[var(--theme-border)] hover:border-white/15 focus:border-[#7C3AED] focus:ring-0 outline-none px-12 py-3.5 text-xs text-white tracking-wider transition-colors placeholder:text-[#444]"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[var(--theme-grey)] transition-colors"
              >
                {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>

            {/* forgot password link */}
            {isLoginMode && (
              <div className="flex justify-end">
                <button type="button" className="text-[10px] text-[#555] hover:text-[var(--theme-grey)] transition-colors uppercase tracking-wider">
                  Forgot password?
                </button>
              </div>
            )}

            {/* submit button with Sweep effect */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs uppercase tracking-[0.25em] rounded-none transition-colors shadow-lg overflow-hidden group flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <>
                  <span>{isLoginMode ? 'Continue' : 'Create Account'}</span>
                  <ArrowRight size={14} />
                </>
              )}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/15 opacity-40 group-hover:animate-shine" />
            </button>

          </form>

          {/* divider */}
          <div className="flex items-center gap-4 text-[#222]">
            <div className="flex-1 h-[1px] bg-[var(--theme-card)]" />
            <span className="text-[9px] text-[#555] tracking-widest font-bold">OR</span>
            <div className="flex-1 h-[1px] bg-[var(--theme-card)]" />
          </div>

          {/* Social Sign In Options */}
          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-[#111] border border-[var(--theme-border)] hover:border-white/20 text-xs font-bold text-[var(--theme-grey)] hover:text-[var(--theme-text)] transition-all flex items-center justify-center">
              <GoogleIcon />
              <span>GOOGLE</span>
            </button>
            <button className="flex-1 py-3 bg-[#111] border border-[var(--theme-border)] hover:border-white/20 text-xs font-bold text-[var(--theme-grey)] hover:text-[var(--theme-text)] transition-all flex items-center justify-center">
              <AppleIcon />
              <span>APPLE</span>
            </button>
          </div>

          {/* toggle between login/register */}
          <p className="text-center text-[10px] text-[#555] tracking-wider uppercase">
            {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              onClick={() => { setIsLoginMode(!isLoginMode); setLocalError(''); }}
              className="text-[var(--theme-text)] hover:text-[#7C3AED] transition-colors font-bold underline ml-1"
            >
              {isLoginMode ? 'Register Now' : 'Log In'}
            </button>
          </p>

        </div>
      </motion.div>

    </div>
  );
};

export default Login;