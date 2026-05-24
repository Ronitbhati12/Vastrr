import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const linkVariants = {
  hover: {
    x: 5,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
};

const FooterColumn = ({ title, links }) => (
  <motion.div variants={itemVariants} className="space-y-6 z-10 font-mono">
    <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--theme-grey)]">
      {title}
    </h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <motion.a
            href={link.href}
            variants={linkVariants}
            whileHover="hover"
            className="inline-block text-xs uppercase tracking-[0.1em] text-[var(--theme-grey)] hover:text-[var(--theme-text)] transition-colors"
          >
            {link.label}
          </motion.a>
        </li>
      ))}
    </ul>
  </motion.div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { label: 'New Arrivals', href: '#' },
    { label: 'Bestsellers', href: '#' },
    { label: 'Collections', href: '#' },
    { label: 'Archive', href: '#' },
  ];

  const infoLinks = [
    { label: 'Our Story', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Journal', href: '#' },
    { label: 'Careers', href: '#' },
  ];

  const supportLinks = [
    { label: 'Shipping', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Size Guide', href: '#' },
  ];

  return (
    <footer className="bg-[var(--theme-bg)] text-[var(--theme-text)] py-24 relative overflow-hidden border-t border-[var(--theme-border)]">
      
      {/* Massive Background Typography */}
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02] text-center w-full z-0">
        <h1 className="text-[20vw] font-black uppercase tracking-tighter leading-none font-display">
          VASTRR
        </h1>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-6 md:px-12 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-6 gap-16 mb-20">
          {/* Brand & Newsletter Column - Spans 2 columns */}
          <motion.div variants={itemVariants} className="col-span-2 space-y-8">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-[var(--theme-text)] font-display">
              VASTRR<span className="text-[#7C3AED]">.</span>
            </h2>
            <p className="text-xs text-[var(--theme-grey)] max-w-xs font-mono tracking-wider leading-relaxed uppercase">
              NOT MADE FOR EVERYONE. UNCOMPROMISED CONFIDENCE. WEAR THE ATTITUDE.
            </p>
            {/* Minimalist Newsletter Input */}
            <div className="flex items-center gap-2 border-b border-[var(--theme-border)] py-3 focus-within:border-[#7C3AED] transition-colors max-w-sm font-mono">
              <input 
                type="email" 
                placeholder="JOIN THE ATTITUDE (EMAIL)" 
                className="bg-transparent text-[10px] uppercase font-bold tracking-wider placeholder-gray-500 text-[var(--theme-text)] outline-none w-full"
              />
              <button className="text-[var(--theme-grey)] hover:text-[#7C3AED] transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          {/* Spacer for MD screens */}
          <div className="hidden md:block col-span-1" />

          {/* Links Columns */}
          <FooterColumn title="Explore" links={shopLinks} />
          <FooterColumn title="Company" links={infoLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-[var(--theme-border)] flex flex-col sm:flex-row justify-between items-center gap-6 font-mono"
        >
          <div className="flex items-center gap-6">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -3, scale: 1.05 }}
                className="text-[var(--theme-grey)] hover:text-[var(--theme-text)] transition-colors"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>

          <p className="text-[9px] font-bold tracking-[0.25em] text-[var(--theme-grey)] uppercase text-center sm:text-left">
            © {currentYear} VASTRR CLOTHING. ALL RIGHTS RESERVED.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;