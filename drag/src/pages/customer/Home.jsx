import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, Zap, ShoppingBag, ShieldAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProductStore from '../../store/useProductStore';
import ProductCard from '../../components/ProductCard';
import GlowCard from '../../components/GlowCard';

// Magnetic/Separating Text Component
const LetterReveal = ({ text }) => {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block mr-4 whitespace-nowrap">
          {word.split("").map((char, cIdx) => (
            <motion.span
              key={cIdx}
              initial={{ opacity: 0, filter: 'blur(10px)', y: 40 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5 + (wIdx * 0.1) + (cIdx * 0.03),
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                scale: 1.15,
                color: '#7C3AED',
                transition: { duration: 0.1 }
              }}
              className="inline-block origin-bottom font-display cursor-default"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

// 2D Storefront Blueprint component
const Storefront = ({ name, type, icon, count, onClick, active }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -8, borderColor: '#7C3AED' }}
      whileTap={{ scale: 0.98 }}
      className={`relative shrink-0 w-80 h-[380px] border ${active ? 'border-[#7C3AED] bg-[var(--theme-card)]' : 'border-[var(--theme-border)] bg-black/40'} p-6 flex flex-col justify-between cursor-pointer transition-all group`}
    >
      {/* 2D Roof Outline */}
      <div className="absolute -top-3 left-0 w-full h-3 border-t border-x border-inherit group-hover:border-[#7C3AED]" />
      
      {/* Store Header Info */}
      <div className="flex justify-between items-start font-mono border-b border-[var(--theme-border)] pb-4">
        <div>
          <span className="text-[8px] text-[#555] tracking-widest uppercase block">SECTOR_STORE</span>
          <h3 className="text-xs font-bold text-white tracking-widest uppercase mt-1">{name}</h3>
        </div>
        <span className="text-[9px] text-[#7C3AED] font-bold font-mono">[{count}]</span>
      </div>

      {/* 2D Blueprint Display Window */}
      <div className="flex-1 py-6 flex items-center justify-center relative overflow-hidden bg-black/20 my-4 border border-[var(--theme-border)]">
        {/* Glass glare effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {icon === 'tee' && (
          <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-white/20 group-hover:stroke-white transition-colors duration-500 fill-none" strokeWidth="1.5">
            <line x1="10" y1="25" x2="90" y2="25" />
            <line x1="20" y1="25" x2="20" y2="90" />
            <line x1="80" y1="25" x2="80" y2="90" />
            {/* shirt hanger */}
            <path d="M43,35 L50,28 L57,35 L57,65 L43,65 Z" className="group-hover:stroke-[#7C3AED] transition-colors" />
            <path d="M48,28 C50,28 50,22 51,22 C52,22 52,28 54,28" />
            {/* secondary shirt */}
            <path d="M28,45 L33,40 L38,45 L38,70 L28,70 Z" />
            <path d="M31,40 C32,40 32,36 33,36" />
          </svg>
        )}

        {icon === 'outer' && (
          <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-white/20 group-hover:stroke-white transition-colors duration-500 fill-none" strokeWidth="1.5">
            {/* Mannequin stand */}
            <line x1="50" y1="20" x2="50" y2="85" />
            <line x1="35" y1="85" x2="65" y2="85" />
            {/* Jacket outline */}
            <path d="M35,35 C35,25 65,25 65,35 L60,70 L40,70 Z" className="group-hover:stroke-[#7C3AED] transition-colors" />
            <circle cx="50" cy="20" r="4" />
            {/* Zipper line */}
            <line x1="50" y1="29" x2="50" y2="70" strokeDasharray="3,3" />
          </svg>
        )}

        {icon === 'access' && (
          <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-white/20 group-hover:stroke-white transition-colors duration-500 fill-none" strokeWidth="1.5">
            {/* Display pedestal */}
            <rect x="30" y="55" width="40" height="30" />
            {/* Sunglasses wireframe */}
            <path d="M22,40 L78,40" className="group-hover:stroke-[#7C3AED] transition-colors" />
            <path d="M25,40 C25,46 38,46 38,40 M62,40 C62,46 75,46 75,40" className="group-hover:stroke-[#7C3AED] transition-colors" />
            <path d="M22,40 L18,30 M78,40 L82,30" />
          </svg>
        )}
      </div>

      {/* Doorway Entrance */}
      <div className="border-t border-[var(--theme-border)] pt-4 flex justify-between items-center font-mono text-[9px]">
        <span className="text-[#555] uppercase">{type}</span>
        <span className="text-[var(--theme-text)] group-hover:text-[#7C3AED] transition-colors font-bold uppercase">
          {active ? 'CURRENTLY ACTIVE' : 'ENTER SHOP ↵'}
        </span>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [introState, setIntroState] = useState(0); // 0: Silence, 1: Hype Text, 2: Studio Reveal, 3: Completed
  const { products, fetchProducts } = useProductStore();
  const [selectedMallShop, setSelectedMallShop] = useState(''); // 'tee', 'outer', 'access', ''
  const heroRef = useRef(null);

  // Velocity Stretch Setup
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 });
  
  // Transform values for kinetic stretch and skew based on velocity
  const absVelocity = useTransform(smoothVelocity, v => Math.min(Math.abs(v) / 1500, 0.25));
  const scaleX = useTransform(absVelocity, [0, 0.25], [1, 1.25]);
  const scaleY = useTransform(absVelocity, [0, 0.25], [1, 0.85]);
  const skewX = useTransform(smoothVelocity, [-1500, 1500], [-12, 12]);

  useEffect(() => {
    // Intro sequence timing
    const t1 = setTimeout(() => setIntroState(1), 500);
    const t2 = setTimeout(() => setIntroState(2), 2000);
    const t3 = setTimeout(() => {
      setIntroState(3);
      setTimeout(() => setShowIntro(false), 800);
    }, 4500);

    fetchProducts();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [fetchProducts]);

  // Dynamic filter products by name patterns
  const filteredProducts = products.filter(p => {
    if (!selectedMallShop) return true;
    const name = p.name.toLowerCase();
    if (selectedMallShop === 'tee') {
      return name.includes('t-shirt') || name.includes('tee') || name.includes('shirt');
    }
    if (selectedMallShop === 'outer') {
      return name.includes('jacket') || name.includes('coat') || name.includes('hoodie') || name.includes('outer');
    }
    if (selectedMallShop === 'access') {
      return !name.includes('t-shirt') && !name.includes('tee') && !name.includes('shirt') && !name.includes('jacket') && !name.includes('coat') && !name.includes('hoodie');
    }
    return true;
  });

  const getCount = (shopType) => {
    return products.filter(p => {
      const name = p.name.toLowerCase();
      if (shopType === 'tee') return name.includes('t-shirt') || name.includes('tee') || name.includes('shirt');
      if (shopType === 'outer') return name.includes('jacket') || name.includes('coat') || name.includes('hoodie') || name.includes('outer');
      if (shopType === 'access') return !name.includes('t-shirt') && !name.includes('tee') && !name.includes('shirt') && !name.includes('jacket') && !name.includes('coat') && !name.includes('hoodie');
      return false;
    }).length;
  };

  return (
    <div className="relative bg-[var(--theme-bg)] text-[var(--theme-text)] min-h-screen overflow-hidden selection:bg-[#7C3AED] selection:text-white">
      
      {/* Noise filter */}
      <div className="noise-overlay" />

      {/* ── CINEMATIC INTRO OVERLAY ── */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[var(--theme-bg)] z-[99] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {introState === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="font-mono text-[10px] tracking-[0.4em] text-[var(--theme-grey)] uppercase"
              >
                NOT MADE FOR EVERYONE
              </motion.div>
            )}

            {introState === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.8, 1], scale: [0.97, 1.02, 1] }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-1.5 h-1.5 bg-[#7C3AED] animate-ping rounded-full mb-2" />
                <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-none">
                  RONIT STUDIOS
                </h1>
                <p className="font-mono text-[9px] tracking-[0.3em] text-[var(--theme-grey)] uppercase mt-2">
                  LAUNCHING ARCHIVE // VASTRR
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Loop Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[var(--theme-bg)] z-10" />
          <video 
            src="/14912575-uhd_2160_3840_60fps.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover filter brightness-[0.45]"
          />
        </div>

        {/* Foreground Info */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col justify-end h-full pb-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-[#7C3AED]">
                <Zap size={10} fill="#7C3AED" />
                <span>DROP_01 // COORD: 28.53, 77.39</span>
              </div>

              <h1 className="text-[12vw] lg:text-[9vw] font-black uppercase tracking-tighter leading-[0.8] text-white font-display select-none">
                <LetterReveal text="VASTRR" />
              </h1>

              <p className="max-w-md text-xs font-mono tracking-wide text-[var(--theme-grey)] uppercase leading-relaxed">
                Premium streetwear built for the modern urban landscape. Distinctive. Unapologetic. A luxury dystopian campaign set.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end gap-6">
              <Link 
                to="/shop" 
                className="relative inline-flex items-center justify-between gap-6 px-8 py-4 bg-white text-black font-bold font-mono text-[10px] uppercase tracking-[0.25em] rounded-none hover:bg-[#7C3AED] hover:text-white transition-all duration-300 w-full md:w-auto"
              >
                <span>DISCOVER DROP</span>
                <ArrowDown size={14} className="animate-bounce" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ── 2D CLOTHING MALL SECTOR SECTION (Replaces Manifesto) ── */}
      <section className="relative py-32 bg-[var(--theme-bg)] border-t border-[var(--theme-border)] overflow-hidden">
        
        {/* Giant background typography */}
        <div className="absolute top-10 left-[-5vw] select-none pointer-events-none opacity-[0.01] text-white font-display font-black text-[20vw] leading-none uppercase">
          MALL
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="space-y-4 mb-16">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#7C3AED] uppercase block">
              2D INTERACTIVE SECTOR
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white font-display">
              VASTRR MALL HUB.
            </h2>
            <p className="max-w-md text-xs font-mono text-[var(--theme-grey)] uppercase tracking-wider leading-relaxed">
              Explore the blueprints. Click on any storefront window display to access specific sector storage and filter coordinates.
            </p>
          </div>

          {/* Mall Row */}
          <div className="flex gap-8 overflow-x-auto scrollbar-hide py-6 select-none relative z-10 w-full border-b border-dashed border-[var(--theme-border)] pb-16">
            <Storefront 
              name="VOID LAB" 
              type="STREETWEAR & TEES" 
              icon="tee" 
              count={getCount('tee')}
              onClick={() => setSelectedMallShop(selectedMallShop === 'tee' ? '' : 'tee')}
              active={selectedMallShop === 'tee'}
            />
            <Storefront 
              name="SHADOW TAILOR" 
              type="JACKETS & OUTERWEAR" 
              icon="outer" 
              count={getCount('outer')}
              onClick={() => setSelectedMallShop(selectedMallShop === 'outer' ? '' : 'outer')}
              active={selectedMallShop === 'outer'}
            />
            <Storefront 
              name="NOIR ACCESSORIES" 
              type="GEAR & CAPS" 
              icon="access" 
              count={getCount('access')}
              onClick={() => setSelectedMallShop(selectedMallShop === 'access' ? '' : 'access')}
              active={selectedMallShop === 'access'}
            />
          </div>

          {selectedMallShop && (
            <div className="mt-8 flex justify-between items-center font-mono">
              <span className="text-[10px] text-[#7C3AED] uppercase tracking-widest animate-pulse">
                • FILTER ACTIVE: SHOPPING AT {selectedMallShop === 'tee' ? 'VOID LAB' : selectedMallShop === 'outer' ? 'SHADOW TAILOR' : 'NOIR ACCESSORIES'}
              </span>
              <button 
                onClick={() => setSelectedMallShop('')} 
                className="text-[10px] text-[var(--theme-grey)] hover:text-white uppercase tracking-widest border-b border-[var(--theme-grey)] hover:border-white pb-0.5"
              >
                LEAVE MALL SECTION [ALL GEAR]
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── PREMIUM ARCHIVE SECTORS ── */}
      <section className="relative py-24 bg-[var(--theme-bg)] border-t border-[var(--theme-border)] overflow-hidden flex flex-col items-center">
        <div className="absolute top-[30%] left-[10%] select-none pointer-events-none opacity-[0.005] text-[#bd9f67] font-display font-black text-[22vw] leading-none uppercase">
          GOLD
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center space-y-16 relative z-10">
          <div className="space-y-4">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#bd9f67] uppercase block">
              PREMIUM VASTRR ARCHIVE
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white font-display">
              EXHIBIT ROOMS.
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-12 pt-6">
            
            {/* Card 1: VOID LAB */}
            <div className="group relative grid h-[200px] w-[300px] place-content-center overflow-hidden rounded-xl bg-[#0b0b0b] border border-[var(--theme-border)] transition-all duration-500 ease-in-out hover:scale-105 hover:rounded-none hover:border-[#bd9f67]/30">
              <div className="absolute inset-0 rotate-[10deg] border border-[#bd9f67] opacity-0 transition-all duration-500 ease-in-out group-hover:inset-[12px] group-hover:rotate-0 group-hover:opacity-100" />
              <div className="relative z-10 transition-all duration-500 ease-in-out">
                <div className="relative h-[35px] w-[33px] overflow-hidden transition-all duration-1000 ease-in-out group-hover:w-[134px]">
                  <div className="absolute left-0 h-[33px]">
                    <svg viewBox="0 0 29.667 31.69" xmlns="http://www.w3.org/2000/svg" className="h-full fill-[#bd9f67]">
                      <path d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" />
                      <path d="M29.3,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,24.837,0h2.98A1.561,1.561,0,0,1,29.3,1.628Z" />
                      <path d="M0,28.055A1.561,1.561,0,0,1,1.483,26.427h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,30.062Z" />
                    </svg>
                  </div>
                  <div className="absolute left-[33px] h-[33px] flex items-center">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider pl-2 font-mono">VOID</span>
                  </div>
                  <span className="absolute right-0 h-full w-full opacity-0 group-hover:animate-trail" />
                </div>
                <span className="absolute left-1/2 top-1/2 mt-[30px] -translate-x-1/2 -translate-y-1/2 pl-[8px] text-[10px] text-[#bd9f67] opacity-0 transition-all duration-500 delay-500 ease-in-out group-hover:opacity-100 group-hover:tracking-[8px] font-mono">
                  VOID.LAB
                </span>
              </div>
              <span className="absolute bottom-[13px] left-1/2 -translate-x-1/2 bg-[var(--theme-bg)] px-[5px] pl-[8px] text-[6px] uppercase tracking-[7px] text-[#bd9f67] opacity-0 transition-all duration-500 ease-in-out group-hover:tracking-[3px] group-hover:opacity-100 font-mono">
                engineered in silence
              </span>
            </div>

            {/* Card 2: SHADOW TAILOR */}
            <div className="group relative grid h-[200px] w-[300px] place-content-center overflow-hidden rounded-xl bg-[#0b0b0b] border border-[var(--theme-border)] transition-all duration-500 ease-in-out hover:scale-105 hover:rounded-none hover:border-[#bd9f67]/30">
              <div className="absolute inset-0 rotate-[10deg] border border-[#bd9f67] opacity-0 transition-all duration-500 ease-in-out group-hover:inset-[12px] group-hover:rotate-0 group-hover:opacity-100" />
              <div className="relative z-10 transition-all duration-500 ease-in-out">
                <div className="relative h-[35px] w-[33px] overflow-hidden transition-all duration-1000 ease-in-out group-hover:w-[134px]">
                  <div className="absolute left-0 h-[33px]">
                    <svg viewBox="0 0 29.667 31.69" xmlns="http://www.w3.org/2000/svg" className="h-full fill-[#bd9f67]">
                      <path d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" />
                      <path d="M29.3,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,24.837,0h2.98A1.561,1.561,0,0,1,29.3,1.628Z" />
                      <path d="M0,28.055A1.561,1.561,0,0,1,1.483,26.427h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,30.062Z" />
                    </svg>
                  </div>
                  <div className="absolute left-[33px] h-[33px] flex items-center">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider pl-2 font-mono">SHADOW</span>
                  </div>
                  <span className="absolute right-0 h-full w-full opacity-0 group-hover:animate-trail" />
                </div>
                <span className="absolute left-1/2 top-1/2 mt-[30px] -translate-x-1/2 -translate-y-1/2 pl-[8px] text-[10px] text-[#bd9f67] opacity-0 transition-all duration-500 delay-500 ease-in-out group-hover:opacity-100 group-hover:tracking-[8px] font-mono">
                  SHADOW.CUSTOMS
                </span>
              </div>
              <span className="absolute bottom-[13px] left-1/2 -translate-x-1/2 bg-[var(--theme-bg)] px-[5px] pl-[8px] text-[6px] uppercase tracking-[7px] text-[#bd9f67] opacity-0 transition-all duration-500 ease-in-out group-hover:tracking-[3px] group-hover:opacity-100 font-mono">
                dystopian apparel
              </span>
            </div>

            {/* Card 3: NOIR ACCESSORIES */}
            <div className="group relative grid h-[200px] w-[300px] place-content-center overflow-hidden rounded-xl bg-[#0b0b0b] border border-[var(--theme-border)] transition-all duration-500 ease-in-out hover:scale-105 hover:rounded-none hover:border-[#bd9f67]/30">
              <div className="absolute inset-0 rotate-[10deg] border border-[#bd9f67] opacity-0 transition-all duration-500 ease-in-out group-hover:inset-[12px] group-hover:rotate-0 group-hover:opacity-100" />
              <div className="relative z-10 transition-all duration-500 ease-in-out">
                <div className="relative h-[35px] w-[33px] overflow-hidden transition-all duration-1000 ease-in-out group-hover:w-[134px]">
                  <div className="absolute left-0 h-[33px]">
                    <svg viewBox="0 0 29.667 31.69" xmlns="http://www.w3.org/2000/svg" className="h-full fill-[#bd9f67]">
                      <path d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" />
                      <path d="M29.3,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,24.837,0h2.98A1.561,1.561,0,0,1,29.3,1.628Z" />
                      <path d="M0,28.055A1.561,1.561,0,0,1,1.483,26.427h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,30.062Z" />
                    </svg>
                  </div>
                  <div className="absolute left-[33px] h-[33px] flex items-center">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider pl-2 font-mono">NOIR</span>
                  </div>
                  <span className="absolute right-0 h-full w-full opacity-0 group-hover:animate-trail" />
                </div>
                <span className="absolute left-1/2 top-1/2 mt-[30px] -translate-x-1/2 -translate-y-1/2 pl-[8px] text-[10px] text-[#bd9f67] opacity-0 transition-all duration-500 delay-500 ease-in-out group-hover:opacity-100 group-hover:tracking-[8px] font-mono">
                  NOIR.SYSTEM
                </span>
              </div>
              <span className="absolute bottom-[13px] left-1/2 -translate-x-1/2 bg-[var(--theme-bg)] px-[5px] pl-[8px] text-[6px] uppercase tracking-[7px] text-[#bd9f67] opacity-0 transition-all duration-500 ease-in-out group-hover:tracking-[3px] group-hover:opacity-100 font-mono">
                tactical tech accessories
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── INVENTORY/SHOWCASE SECTION ── */}
      <section className="relative py-32 bg-[var(--theme-bg)] border-t border-[var(--theme-border)]">
        
        <div className="absolute top-[20%] right-[-10vw] select-none pointer-events-none opacity-[0.012] text-white font-display font-black text-[22vw] leading-none uppercase">
          ARCHIVE
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-20">
            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#7C3AED] uppercase block mb-3">
                CURRENT CATALOGUE
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white font-display">
                THE INVENTORY.
              </h2>
            </div>
            <Link 
              to="/shop" 
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--theme-grey)] hover:text-white border-b border-[var(--theme-grey)] pb-1 hover:border-white transition-all duration-200"
            >
              BROWSE ALL GEAR ({products?.length || 0})
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <GlowCard />
            {filteredProducts && filteredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}