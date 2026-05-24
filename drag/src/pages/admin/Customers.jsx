import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, ExternalLink } from 'lucide-react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const glassPanel = "bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]";
  const glassInput = "bg-[var(--theme-card)]0 backdrop-blur-md border border-white/60 focus:bg-white/80 focus:ring-4 focus:ring-white/50 shadow-inner outline-none text-sm text-slate-800 placeholder:text-slate-400";
  const glassCard = "bg-[var(--theme-card)]0 backdrop-blur-md border border-white/60 shadow-sm";

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  const getUserToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo ? userInfo.token : null;
  };

  const getAuthHeaders = () => {
    const token = getUserToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/users', getAuthHeaders());
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 relative scrollbar-hide">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-2">Customers</h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">View and manage user data</p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <motion.div variants={fadeUp} className={`p-6 rounded-4xl ${glassCard}`}>
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Total Customers</p>
             <h3 className="text-3xl font-black text-slate-800">{customers.length}</h3>
           </motion.div>
           <motion.div variants={fadeUp} className={`p-6 rounded-4xl ${glassCard}`}>
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Active Status</p>
             <h3 className="text-3xl font-black text-emerald-600">Online</h3>
           </motion.div>
           <motion.div variants={fadeUp} className={`p-6 rounded-4xl ${glassCard} flex items-center justify-center`}>
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" placeholder="Search by name or email..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full py-4 pl-11 pr-4 rounded-[1.25rem] ${glassInput}`}
                />
              </div>
           </motion.div>
        </motion.div>

        {/* Customer List */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className={`rounded-[2.5rem] overflow-hidden ${glassPanel}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Spent</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, i) => (
                    <tr key={customer.id || i} className="hover:bg-white/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black shadow-sm bg-purple-100 text-purple-650">
                            {customer.name ? customer.name[0].toUpperCase() : 'C'}
                          </div>
                          <span className="text-sm font-black text-slate-800">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <Mail size={12} /> {customer.email}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-slate-800">
                        ₹{customer.totalSpent || 0}
                      </td>
                      <td className="px-8 py-6 text-xs font-semibold text-slate-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 font-mono text-xs text-slate-400 uppercase tracking-widest">
                      {isLoading ? 'Loading customers...' : 'No customers found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Customers;