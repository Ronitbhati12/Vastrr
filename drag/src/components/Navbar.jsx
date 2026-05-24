import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, User, LogOut, ShieldAlert, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import AnimatedMenuIcon from './AnimatedMenuIcon';
import TextScramble from './TextScramble';

const Navbar = ({ toggleCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore(s => s.cartItems).reduce((a, c) => a + c.quantity, 0);
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-500 border-b ${scrolled ? 'bg-[var(--theme-nav-bg)] backdrop-blur-2xl border-[var(--theme-border)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.8)]' : 'bg-transparent border-transparent'}`}
      >
        <div className="flex items-center gap-6">
          <AnimatedMenuIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          <Link to="/" className="text-2xl font-black uppercase tracking-tighter text-[var(--theme-text)] font-display hover:opacity-85 transition-opacity">
            <TextScramble text="VASTRR" /><span className="text-[#7C3AED]">.</span>
          </Link>
        </div>

        {/* Center menu links */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="relative group text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--theme-grey)] hover:text-[var(--theme-text)] transition-colors font-mono"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#7C3AED] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          {user?.role === 'Admin' && (
            <Link 
              to="/admin" 
              className="text-[11px] font-bold uppercase tracking-[0.25em] text-rose-500 flex items-center gap-1.5 hover:text-rose-450 transition-colors font-mono"
            >
              <ShieldAlert size={12} /> Admin
            </Link>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="text-[var(--theme-text)] hover:text-[#7C3AED] transition-colors p-1">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4 bg-[var(--theme-border)] px-4 py-1.5 border border-[var(--theme-border)] font-mono">
              <span className="hidden md:block text-[9px] font-bold text-[var(--theme-text)] tracking-[0.25em]">HI, {user.name.split(' ')[0].toUpperCase()}</span>
              <button onClick={handleLogout} className="text-[var(--theme-grey)] hover:text-[#7C3AED] transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-[var(--theme-border)] p-2 border border-[var(--theme-border)] text-[var(--theme-text)] hover:bg-[#7C3AED] hover:border-[#7C3AED] hover:text-white transition-all duration-300">
              <User size={16} />
            </Link>
          )}
          
          <button 
            onClick={toggleCart} 
            className="relative bg-[#7C3AED] text-white p-2.5 hover:bg-[#6D28D9] transition-all duration-300 shadow-[0_8px_20px_rgba(124,58,237,0.2)]"
          >
            <ShoppingBag size={16} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center border border-black font-mono">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.3 }}
            className="fixed top-[70px] left-0 w-full z-45 bg-[var(--theme-nav-bg)] backdrop-blur-3xl border-b border-[var(--theme-border)] p-8 flex flex-col gap-6 md:hidden font-mono"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)} 
                className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--theme-grey)] hover:text-[var(--theme-text)] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user?.role === 'Admin' && (
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                className="text-sm font-bold uppercase tracking-[0.25em] text-rose-500 flex items-center gap-2"
              >
                <ShieldAlert size={16} /> Admin Panel
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;