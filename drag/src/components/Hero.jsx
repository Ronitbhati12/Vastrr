import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useContentStore from '../store/useContentStore';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { content, fetchContent } = useContentStore();
  const container = useRef(null);
  const ctaRef = useRef(null);
  const marqueeRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const splitText = (text) => text?.split(' ').map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-4 -mb-4 perspective-[1000px]">
      <span className="gsap-word inline-block origin-bottom translate-y-[120%] rotateX-[90deg] opacity-0">
        {word}
      </span>&nbsp;
    </span>
  ));

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.fromTo('.gsap-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 })
      .to('.gsap-word', { y: '0%', rotateX: '0deg', opacity: 1, duration: 1.2, stagger: 0.05 }, "-=0.8")
      .fromTo('.gsap-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.8")
      .fromTo(imageRef.current, { opacity: 0, scale: 0.8, rotateY: -30, rotateX: 20 }, { opacity: 1, scale: 1, rotateY: 0, rotateX: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }, "-=1")
      .fromTo('.gsap-cta', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, "-=1");

    gsap.to('.gsap-hero-content', {
      yPercent: 40, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: container.current, start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.to(imageRef.current, {
      y: -25, rotateY: 8, rotateX: 4, repeat: -1, yoyo: true, duration: 3.5, ease: "sine.inOut"
    });

    const marqueeContent = marqueeRef.current.children[0];
    marqueeRef.current.appendChild(marqueeContent.cloneNode(true));
    gsap.to(marqueeRef.current.children, { xPercent: -100, repeat: -1, duration: 25, ease: 'none' });
  }, { scope: container });

  const handleMouseMove = (e) => {
    if (!ctaRef.current) return;
    const { left, top, width, height } = ctaRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.3;
    const y = (e.clientY - (top + height / 2)) * 0.3;
    gsap.to('.gsap-cta-text', { x, y, duration: 1, ease: 'power3.out' });
  };

  const handleMouseLeave = () => gsap.to('.gsap-cta-text', { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });

  return (
    <div ref={container} className="relative pt-32 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden bg-[#f3f4f6] perspective-[2000px]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-blue-300/40 blur-[130px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[5%] right-[10%] w-[55vw] h-[55vw] rounded-full bg-rose-300/30 blur-[150px] animate-pulse" style={{ animationDuration: '9s' }} />
      </div>
      
      <div className="gsap-hero-content relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        <div className="flex-1 text-left z-20">
          <div className="gsap-badge inline-block px-5 py-2.5 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] mb-8">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-800">{content?.heroBadge || 'ULTRA PREMIUM DROP'}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-slate-900 leading-[0.85] mb-8 uppercase drop-shadow-sm">
            <span className="block">{splitText(content?.heroTitle1 || 'ELEVATE')}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400 block mt-2">
              {splitText(content?.heroTitle2 || 'THE AURA.')}
            </span>
          </h1>
          
          <p className="gsap-desc max-w-lg text-lg md:text-xl text-slate-600 font-bold tracking-wide leading-relaxed mb-12">
            {content?.heroDescription || 'Cinematic streetwear engineered for the absolute elite. Unmatched precision. 3D dynamics.'}
          </p>
          
          <div className="gsap-cta inline-block p-1.5 rounded-4xl border border-[var(--theme-border)]0 bg-white/30 backdrop-blur-xl shadow-2xl">
            <Link to="/shop" ref={ctaRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="group relative inline-flex items-center justify-center px-10 py-5 font-black tracking-[0.15em] text-[12px] uppercase text-white bg-slate-900 overflow-hidden rounded-3xl shadow-[0_20px_50px_-10px_rgba(15,23,42,0.5)] transition-all duration-500">
              <div className="absolute inset-0 bg-slate-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-3xl" />
              <span className="gsap-cta-text relative z-10 flex items-center gap-3">
                {content?.heroCta || 'EXPLORE COLLECTION'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </Link>
          </div>
        </div>

        <div className="flex-1 relative z-10 w-full h-[500px] flex items-center justify-center perspective-[1200px]">
          <div ref={imageRef} className="relative w-full max-w-md aspect-square rounded-[3rem] bg-white/20 backdrop-blur-3xl border border-[var(--theme-border)]0 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex items-center justify-center transform-gpu">
             <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" alt="3D Product" className="w-[130%] h-auto absolute z-20 drop-shadow-[0_50px_50px_rgba(0,0,0,0.5)] scale-110 pointer-events-none" style={{ transform: 'translateZ(80px)' }} />
             <div className="absolute inset-4 rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
          </div>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-white/40 backdrop-blur-2xl border-t border-white/60 py-4 flex z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
          <div className="flex gap-16 px-8 items-center">
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-[12px] font-black tracking-[0.3em] uppercase text-slate-800">
                  {i % 2 === 0 ? (content?.marqueeText1 || 'NEW COLLECTION OUT NOW') : (content?.marqueeText2 || 'LIMITED STOCK')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Hero;