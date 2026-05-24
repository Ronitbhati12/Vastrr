import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  // 3D Tilt Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-150, 150], [-8, 8]);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: '1000px' }} className="w-full h-full">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d',
        }}
        className="group relative bg-[#0a0a0a] border border-[var(--theme-border)] rounded-none overflow-hidden transition-all duration-300 hover:border-white/20 w-full h-full transform-gpu"
      >
        <div style={{ transformStyle: 'preserve-3d' }} className="aspect-3/4 overflow-hidden bg-[#111111] relative">
          <motion.img 
            src={product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'} 
            alt={product.name} 
            style={{ transform: 'translateZ(15px)' }}
            className="w-full h-full object-cover rounded-none scale-100 group-hover:scale-105 transition-transform duration-700 filter brightness-95"
          />
          
          {/* Quick Add Button */}
          <motion.button 
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            style={{ transform: 'translateZ(30px)' }}
            className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-none shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-350 hover:bg-[#7C3AED] hover:text-white"
          >
            <ShoppingBag size={16} />
          </motion.button>
        </div>

        <div style={{ transform: 'translateZ(20px)' }} className="p-5 font-mono">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--theme-text)] group-hover:text-[#7C3AED] transition-colors">{product.name}</h3>
              <p className="text-[10px] font-medium text-[var(--theme-grey)] uppercase tracking-widest mt-1">{product.material}</p>
            </div>
            <span className="text-sm font-bold text-[var(--theme-text)]">${product.price}</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-3.5 h-3.5 shadow-inner border border-white/20" style={{ backgroundColor: product.colorCode || '#000' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;
