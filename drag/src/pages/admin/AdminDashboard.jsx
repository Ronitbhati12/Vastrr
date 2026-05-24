import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, ShoppingBag, Users, Activity, 
  ArrowUpRight, ArrowDownRight, Package, Calendar
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    recentOrders: [],
    monthlyRevenue: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Shared Glass Morphism Utilities
  const glassPanel = "bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]";
  const glassCard = "bg-[var(--theme-card)]0 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-shadow";
  const glassButton = "bg-white/60 backdrop-blur-md border border-white/80 hover:bg-white/90 shadow-[0_4px_15px_0_rgba(0,0,0,0.05)] text-slate-800";

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const getUserToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo ? userInfo.token : null;
  };

  const getAuthHeaders = () => {
    const token = getUserToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/analytics', getAuthHeaders());
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const kpiStats = [
    { title: "Total Revenue", value: `₹${analytics.totalRevenue.toLocaleString()}`, trend: "+12.5%", isPositive: true, icon: <DollarSign size={20} /> },
    { title: "Total Orders", value: `${analytics.totalOrders}`, trend: "+8.2%", isPositive: true, icon: <ShoppingBag size={20} /> },
    { title: "Active Customers", value: `${analytics.activeCustomers}`, trend: "+15.3%", isPositive: true, icon: <Users size={20} /> },
    { title: "Conversion Rate", value: "3.2%", trend: "-0.8%", isPositive: false, icon: <Activity size={20} /> },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'Processing': return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'Shipped': return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
      default: return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
    }
  };

  // Build monthly values array (Jan to Dec)
  const monthlyValues = Array(12).fill(0);
  if (analytics.monthlyRevenue) {
    analytics.monthlyRevenue.forEach(item => {
      const idx = item._id - 1;
      if (idx >= 0 && idx < 12) {
        monthlyValues[idx] = item.total;
      }
    });
  }
  const maxVal = Math.max(...monthlyValues, 1000);
  const barHeights = monthlyValues.map(val => (val / maxVal) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 relative scrollbar-hide">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-2">
              Overview
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Your store's performance at a glance.
            </p>
          </div>
          <button 
            onClick={fetchAnalytics}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest transition-all ${glassButton}`}
          >
            <Calendar size={14} /> Refresh Summary
          </button>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div 
          variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {kpiStats.map((stat, index) => (
            <motion.div key={index} variants={fadeUp} className={`p-6 rounded-4xl flex flex-col justify-between h-40 ${glassCard}`}>
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-slate-700 shadow-sm border border-white">
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${stat.isPositive ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-600 bg-rose-500/10 border-rose-500/20'}`}>
                  {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts & Orders Section */}
        <motion.div 
          variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Sales Chart */}
          <motion.div variants={fadeUp} className={`lg:col-span-2 p-8 rounded-[2.5rem] flex flex-col ${glassPanel}`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black text-slate-800">Revenue Analytics</h2>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto">
              {barHeights.map((height, i) => (
                <div 
                  key={i} 
                  className="w-full bg-white/30 rounded-t-lg relative group transition-all hover:bg-slate-800/80" 
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                    ₹{monthlyValues[i].toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 border-t border-white/40 pt-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{month}</span>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders List */}
          <motion.div variants={fadeUp} className={`p-8 rounded-[2.5rem] ${glassPanel}`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black text-slate-800">Recent Orders</h2>
            </div>
            <div className="space-y-4">
              {analytics.recentOrders.length > 0 ? (
                analytics.recentOrders.map((order, index) => (
                  <div key={order.id || index} className={`p-4 rounded-2xl flex items-center gap-4 ${glassCard}`}>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shrink-0">
                      <Package size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{order.customer?.name || 'Guest'}</h4>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800">₹{order.totalAmount}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border mt-1 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center font-mono text-xs text-slate-400 py-10 uppercase tracking-widest">
                  No orders recorded yet.
                </p>
              )}
            </div>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;