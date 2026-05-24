import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Filter, Download, MoreVertical, Edit2 } from 'lucide-react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [statusValue, setStatusValue] = useState('');

  // Shared Glass Morphism Classes
  const glassPanel = "bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]";
  const glassButton = "bg-white/60 backdrop-blur-md border border-white/80 hover:bg-white/90 shadow-[0_4px_15px_0_rgba(0,0,0,0.05)] text-slate-800 transition-all";
  const glassInput = "bg-[var(--theme-card)]0 backdrop-blur-md border border-white/60 focus:bg-white/80 focus:ring-4 focus:ring-white/50 shadow-inner outline-none text-sm text-slate-800 placeholder:text-slate-400";

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  const getUserToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo ? userInfo.token : null;
  };

  const getAuthHeaders = () => {
    const token = getUserToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders', getAuthHeaders());
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, getAuthHeaders());
      setEditingOrderId(null);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Delivered': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'Shipped': return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
      case 'Processing': return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      default: return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const idStr = `#ORD-00${order.id}`.toLowerCase();
    const custName = (order.customer?.name || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return idStr.includes(query) || custName.includes(query);
  });

  const getItemsCount = (order) => {
    // If order has items inside
    return order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 relative scrollbar-hide">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-2">Orders</h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Manage fulfillments and sales</p>
          </div>
          <button 
            onClick={fetchOrders}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest ${glassButton}`}
          >
            Refresh Orders
          </button>
        </motion.div>

        {/* Action Bar */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Search orders by ID or customer..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-4 pl-11 pr-4 rounded-[1.25rem] ${glassInput}`}
            />
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className={`rounded-[2.5rem] overflow-hidden ${glassPanel}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Total</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, i) => (
                    <tr key={order.id || i} className="hover:bg-white/20 transition-colors group">
                      <td className="px-8 py-6 text-sm font-black text-slate-800">#ORD-00{order.id}</td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-700">
                        {order.customer?.name || 'Guest Customer'}
                        <span className="text-[10px] text-slate-400 font-semibold block">{order.customer?.email}</span>
                      </td>
                      <td className="px-8 py-6 text-xs font-semibold text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        {editingOrderId === order.id ? (
                          <select 
                            value={statusValue} 
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            onBlur={() => setEditingOrderId(null)}
                            className="bg-white/80 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800"
                            autoFocus
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        ) : (
                          <span 
                            onClick={() => { setEditingOrderId(order.id); setStatusValue(order.status); }}
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border cursor-pointer hover:opacity-85 ${getStatusStyle(order.status)}`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-slate-800">
                        ₹{order.totalAmount}
                        <span className="text-[10px] text-slate-400 font-semibold block">{getItemsCount(order)} items</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => { setEditingOrderId(order.id); setStatusValue(order.status); }}
                          className="p-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-[var(--theme-card)]0"
                        >
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 font-mono text-xs text-slate-400 uppercase tracking-widest">
                      {isLoading ? 'Loading orders from database...' : 'No orders found.'}
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

export default Orders;