import React, { useEffect, useState, useRef } from 'react';
import ProductCard from '../../components/ProductCard';
import GlowCard from '../../components/GlowCard';
import useProductStore from '../../store/useProductStore';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Zap } from 'lucide-react';

const PUNCHY = { type: "spring", stiffness: 400, damping: 25 };

/* ── Marquee Background ── */
function TickerTape() {
  return (
    <div style={{
      position: 'absolute', top: '15%', left: 0, right: 0,
      overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.03,
      pointerEvents: 'none', zIndex: 0,
      transform: 'rotate(-2deg) scale(1.1)'
    }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 18 }}
        style={{ display: 'inline-block', fontFamily: "'Syne', sans-serif", fontSize: '15vw', fontWeight: 800, textTransform: 'uppercase', color: 'var(--theme-text)' }}
      >
        VASTRR SS26 // NEW AESTHETIC // VASTRR SS26 // NEW AESTHETIC // VASTRR SS26 // NEW AESTHETIC // 
      </motion.div>
    </div>
  );
}

/* ── Skeleton card ── */
function SkeletonCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...PUNCHY }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '100%', aspectRatio: '3/4', borderRadius: 0, background: '#111111', border: '1px solid #222222' }}
      />
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
        style={{ height: 14, width: '70%', background: '#222222' }}
      />
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        style={{ height: 12, width: '40%', background: '#7C3AED', opacity: 0.5 }}
      />
    </motion.div>
  );
}

/* ── Collection pill (Brutalist) ── */
function CollectionPill({ label, active, onClick, count }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, backgroundColor: active ? '#7C3AED' : '#111111' }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '12px 24px',
        borderRadius: 0,
        border: `1px solid ${active ? '#7C3AED' : '#222222'}`,
        background: active ? '#7C3AED' : 'var(--theme-bg)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
    >
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: active ? '#FFFFFF' : 'var(--theme-grey)',
      }}>{label}</span>
      {count != null && (
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9, fontWeight: 750,
          color: active ? 'rgba(255,255,255,0.7)' : '#555555',
        }}>({count})</span>
      )}
    </motion.button>
  );
}

/* ── Sort dropdown (Cyber Dark) ── */
const SORT_OPTIONS = [
  { v: '', l: 'LATEST DROPS' },
  { v: 'price-asc', l: 'PRICE: LOW > HIGH' },
  { v: 'price-desc', l: 'PRICE: HIGH > LOW' },
  { v: 'newest', l: 'ARCHIVE: NEWEST' },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SORT_OPTIONS.find(o => o.v === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '12px 24px',
          border: '1px solid #222222',
          background: 'var(--theme-bg)',
          cursor: 'pointer',
          fontFamily: "'Space Mono', monospace",
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#7C3AED',
        }}
      >
        <SlidersHorizontal size={12} />
        {current.l}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={PUNCHY}>
          <ChevronDown size={12} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, y: 5, clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#0A0A0A',
              border: '1px solid #222222',
              minWidth: 240, zIndex: 100,
              boxShadow: '0px 10px 30px rgba(0,0,0,0.8)'
            }}
          >
            {SORT_OPTIONS.map(o => (
              <button
                key={o.v}
                onClick={() => { onChange(o.v); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '14px 20px',
                  background: o.v === value ? '#7C3AED' : 'transparent',
                  border: 'none', borderBottom: '1px solid #111111',
                  cursor: 'pointer',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: o.v === value ? '#FFFFFF' : 'var(--theme-grey)',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (o.v !== value) e.currentTarget.style.background = '#111111'; }}
                onMouseLeave={e => { if (o.v !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                {o.l}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// GlowCard is imported from components/GlowCard

/* ── Staggered grid container ── */
function ProductGrid({ products }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 32,
      }}
    >
      {/* Glow Card Promo at start */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: PUNCHY },
        }}
      >
        <GlowCard />
      </motion.div>

      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, scale: 0.95, filter: 'blur(5px)' },
            visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: PUNCHY },
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
    MAIN SHOP COMPONENT
═══════════════════════════════════════════ */
const Shop = () => {
  const { products, collections, fetchProducts, fetchCollections, isLoading } = useProductStore();
  const [selectedCollection, setSelectedCollection] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);
  useEffect(() => { fetchProducts('', selectedCollection); }, [fetchProducts, selectedCollection]);

  const sorted = [...(products || [])].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return 0;
  });

  const activeCollectionName = collections.find(c => c.id === selectedCollection)?.name || 'EVERYTHING';

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { background: var(--theme-bg); margin: 0; }
      `}</style>

      <div style={{
        background: 'var(--theme-bg)', color: 'var(--theme-text)',
        fontFamily: "'Inter', sans-serif",
        minHeight: '100vh', overflowX: 'hidden',
      }}>

        {/* ── HERO HEADER ── */}
        <div
          ref={heroRef}
          style={{
            position: 'relative', overflow: 'hidden',
            paddingTop: 180, paddingBottom: 80,
            paddingLeft: '5vw', paddingRight: '5vw',
            borderBottom: '1px solid #111111'
          }}
        >
          <TickerTape />

          {/* Abstract Aura Glow */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '-10%', right: '10%',
              width: '40vw', height: '40vw',
              background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
              filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
            }} 
          />

          <motion.div style={{ y: titleY, opacity, position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, ...PUNCHY }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#7C3AED', color: '#FFFFFF',
                padding: '6px 12px', fontWeight: 800, fontSize: 10,
                letterSpacing: '0.15em', marginBottom: 24, fontFamily: "'Space Mono', monospace"
              }}
            >
              <Zap size={10} fill="#FFFFFF" color="#FFFFFF" /> SS / 2026 DROP
            </motion.div>

            <h1 style={{
              margin: 0, lineHeight: 0.85,
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(60px, 10vw, 160px)',
              fontWeight: 800, letterSpacing: '-0.04em',
              textTransform: 'uppercase', color: 'var(--theme-text)',
            }}>
              <motion.span 
                initial={{ opacity: 0, y: 60 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, ...PUNCHY }}
                style={{ display: 'block' }}
              >
                THE
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 60 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3, ...PUNCHY }}
                style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1px #7C3AED' }}
              >
                ARCHIVE.
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 40 }}
            >
              <div style={{ height: 1, width: 40, background: '#7C3AED' }} />
              <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: '0.15em', color: 'var(--theme-grey)' }}>
                [{isLoading ? '...' : sorted.length}] ITEMS IN {activeCollectionName}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ── FILTER / SORT TOOLBAR ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...PUNCHY }}
          style={{
            position: 'sticky', top: 72, zIndex: 40,
            background: 'rgba(5,5,5,0.85)',
            backdropFilter: 'blur(30px)',
            borderBottom: '1px solid #111111',
            padding: '16px 5vw',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          }}
        >
          {/* collection pills scroll */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
            flex: 1, paddingBottom: 4,
          }}>
            <CollectionPill
              label="ALL GEAR"
              active={selectedCollection === ''}
              onClick={() => setSelectedCollection('')}
            />
            {collections.map(c => (
              <CollectionPill
                key={c.id}
                label={c.name}
                active={selectedCollection === c.id}
                onClick={() => setSelectedCollection(c.id)}
              />
            ))}
          </div>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </motion.div>

        {/* ── PRODUCT AREA ── */}
        <div style={{ padding: '80px 5vw 160px', minHeight: '60vh' }}>

          {/* Loading state */}
          {isLoading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 32,
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} delay={i * 0.05} />
              ))}
            </div>
          )}

          {/* Empty state / Glitch effect */}
          {!isLoading && sorted.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={PUNCHY}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyCenter: 'center',
                minHeight: 400,
                background: '#0A0A0A',
                border: '1px dashed #222222',
                gap: 24,
                position: 'relative', overflow: 'hidden',
                padding: '40px'
              }}
            >
              <div style={{ position: 'absolute', opacity: 0.01, fontSize: '20vw', fontWeight: 900, whiteSpace: 'nowrap' }}>VOID</div>
              <Zap size={36} color="#7C3AED" />
              <h2 style={{
                fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, margin: 0, color: 'var(--theme-text)', letterSpacing: '-0.02em'
              }}>
                SYSTEM EMPTY
              </h2>
              <p style={{ color: 'var(--theme-grey)', letterSpacing: '0.15em', fontSize: 10, textTransform: 'uppercase', fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>
                No assets found in this sector.
              </p>
              
              {selectedCollection && (
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#7C3AED', color: '#FFFFFF' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCollection('')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px', border: '1px solid #7C3AED',
                    background: 'transparent', color: '#7C3AED',
                    fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
                    borderRadius: 0
                  }}
                >
                  <X size={12} /> PURGE FILTERS
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Products */}
          {!isLoading && sorted.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCollection + sortBy}
                initial={{ opacity: 0, filter: 'blur(5px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(5px)' }}
                transition={{ duration: 0.3 }}
              >
                <ProductGrid products={sorted} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

      </div>
    </>
  );
};

export default Shop;