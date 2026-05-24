import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Loader2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to complete checkout.");
      onClose();
      navigate('/login?redirect=/');
      return;
    }

    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    try {
      const token = user.token;
      const payload = {
        items: cartItems.map(item => ({
          product: item.product.id.toString(),
          quantity: item.quantity,
          price: parseFloat(item.product.price)
        })),
        shippingAddress: {
          street: "Sector 15, Vastrr Compound",
          city: "Noida",
          postalCode: "201301",
          country: "India"
        },
        totalAmount: getCartTotal()
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/orders', 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Order placed successfully! Order ID: #ORD-00${data.id}`);
      clearCart();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[60]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[var(--theme-nav-bg)] backdrop-blur-3xl border-l border-[var(--theme-border)] shadow-[20px_0_50px_rgba(0,0,0,0.8)] z-70 flex flex-col font-mono"
          >
            <div className="p-6 border-b border-[var(--theme-border)] flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[var(--theme-text)] font-display">Your Cart</h2>
              <button onClick={onClose} className="p-2 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-none hover:bg-white/10 transition-colors">
                <X size={16} className="text-[var(--theme-text)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--theme-grey)]">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase">Cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div layout key={item.product.id} className="flex gap-4 p-4 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-none shadow-sm font-mono">
                    <img src={item.product.image || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-16 h-20 object-cover rounded-none" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-[var(--theme-text)] uppercase tracking-wider">{item.product.name}</h3>
                        <p className="text-[10px] text-[var(--theme-grey)] mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[var(--theme-text)]">${item.product.price * item.quantity}</p>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-650 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-[var(--theme-border)] bg-[var(--theme-card)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--theme-grey)]">Total</span>
                <span className="text-xl font-bold text-[var(--theme-text)]">${getCartTotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.length === 0}
                className="relative w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs uppercase tracking-[0.25em] rounded-none transition-colors shadow-lg overflow-hidden group disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> PROCESSING
                    </>
                  ) : (
                    'Checkout'
                  )}
                </span>
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/15 opacity-40 group-hover:animate-shine" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
