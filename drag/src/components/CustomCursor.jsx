import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 30, stiffness: 350 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
    };

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);

    // Bind hover states to interactive elements
    const bindEvents = () => {
      const elements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .group');
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    bindEvents();

    const observer = new MutationObserver(bindEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isHovered ? 2.5 : 1,
        borderColor: isHovered ? '#7C3AED' : 'var(--theme-text)',
        backgroundColor: isHovered ? 'rgba(124, 58, 237, 0.15)' : 'rgba(245, 245, 245, 0.05)',
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
      className="hidden md:block fixed top-0 left-0 w-3 h-3 rounded-full border border-[var(--theme-text)] pointer-events-none z-[9999] mix-blend-difference"
    />
  );
}
