import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  LogOut, 
  Package, 
  Users, 
  Layers 
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import useAuthStore from '../../store/useAuthStore';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdmin();
  
  const user = useAuthStore((state) => state.user);
  const userLogout = useAuthStore((state) => state.logout);

  // Route Guard: only Admins allowed
  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/login?redirect=/admin');
    }
  }, [user, navigate]);

  // Handle Logout & Redirect
  const handleLogout = () => {
    logout();
    userLogout();
    navigate('/');
  };

  if (!user || user.role !== 'Admin') {
    return null;
  }

  // Analytics hata diya gaya hai. Baaki sab proper paths ke sath hain.
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    { path: '/admin/orders', label: 'Orders & Sales', icon: <Package size={18} strokeWidth={1.5} /> },
    { path: '/admin/products', label: 'Products', icon: <ShoppingBag size={18} strokeWidth={1.5} /> },
    { path: '/admin/collections', label: 'Collections', icon: <Layers size={18} strokeWidth={1.5} /> },
    { path: '/admin/customers', label: 'Customers', icon: <Users size={18} strokeWidth={1.5} /> },
  ];

  // Shared Glass Morphism Classes
  const glassPanel = "bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]";
  
  return (
    <div className="flex h-screen bg-slate-50 p-4 md:p-6 gap-6 font-sans text-slate-800 overflow-hidden selection:bg-slate-800 selection:text-white relative z-0">
      
      {/* AMBIENT BACKGROUND BLOBS FOR GLASS REFRACTION */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-200/50 mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-purple-200/50 mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-rose-200/40 mix-blend-multiply filter blur-[80px] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* 3D FLOATING SIDEBAR */}
      <aside className={`w-72 rounded-[2.5rem] flex flex-col z-30 relative overflow-hidden shrink-0 transition-all ${glassPanel}`}>
        
        {/* Brand */}
        <div className="p-8 pb-4 relative z-10">
          <Link to="/" className="text-3xl font-black tracking-tighter text-slate-800 group flex items-center drop-shadow-sm">
            VASTRR<span className="text-slate-400 ml-1 group-hover:scale-110 transition-transform">.</span>
          </Link>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
            Store Admin
          </p>
        </div>
        
        {/* Main Nav (Links act as Navigation) */}
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto relative z-10 scrollbar-hide">
          {navItems.map((item) => {
            // Check if route is active
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden w-full text-left border ${
                  isActive 
                    ? 'bg-white/70 border-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] text-slate-800 backdrop-blur-md' 
                    : 'border-transparent text-slate-500 hover:bg-[var(--theme-card)]0 hover:text-slate-800 hover:border-white/40'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-linear-to-r from-white/60 to-transparent z-0"
                    style={{ borderRadius: '1rem' }}
                  />
                )}
                <span className={`relative z-10 transition-colors ${isActive ? 'text-slate-800 drop-shadow-sm' : ''}`}>
                  {item.icon}
                </span>
                <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.15em]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 relative z-10 bg-linear-to-t from-white/30 to-transparent">
          <motion.button 
            whileHover={{ y: -2 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full px-5 py-4 bg-white/40 border border-[var(--theme-border)]0 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 text-slate-600 rounded-2xl transition-all backdrop-blur-md shadow-sm"
          >
            <LogOut size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 rounded-[2.5rem] flex flex-col relative overflow-hidden transition-all ${glassPanel}`}>
        <Outlet />
      </main>
      
    </div>
  );
};

export default AdminLayout;