import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image as ImageIcon, Edit2, Trash2, X } from 'lucide-react';
import axios from 'axios';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', coverImage: '', status: 'Active'
  });

  const glassPanel = "bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]";
  const glassButton = "bg-white/60 backdrop-blur-md border border-white/80 hover:bg-white/90 shadow-[0_4px_15px_0_rgba(0,0,0,0.05)] text-slate-800 transition-all";
  const glassInput = "bg-[var(--theme-card)]0 backdrop-blur-md border border-white/60 focus:bg-white/80 focus:ring-4 focus:ring-white/50 shadow-inner outline-none text-sm text-slate-800 placeholder:text-slate-400";

  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const getUserToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo ? userInfo.token : null;
  };

  const getAuthHeaders = () => {
    const token = getUserToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/collections');
      setCollections(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenModal = (collection = null) => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description || '',
        coverImage: collection.coverImage || '',
        status: collection.status || 'Active'
      });
      setEditingId(collection.id);
    } else {
      setFormData({ name: '', description: '', coverImage: '', status: 'Active' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/collections/${editingId}`, formData, getAuthHeaders());
      } else {
        await axios.post('http://localhost:5000/api/collections', formData, getAuthHeaders());
      }
      setIsModalOpen(false);
      fetchCollections();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to commit collection");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this collection? This might delete associated products if any.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/collections/${id}`, getAuthHeaders());
      fetchCollections();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove collection");
    }
  };

  // Pastel fallbacks for cover backgrounds
  const coverColors = ['bg-orange-100/50', 'bg-blue-100/50', 'bg-purple-100/50', 'bg-emerald-100/50', 'bg-slate-100/50'];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 relative scrollbar-hide">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-2">Collections</h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Organize your product catalog</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className={`flex items-center gap-2 px-6 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest bg-slate-800 text-white shadow-md hover:bg-slate-900 transition-all hover:scale-105 active:scale-95`}
          >
            <Plus size={16} /> Create Collection
          </button>
        </motion.div>

        {/* Collections Grid */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((col, i) => (
            <motion.div key={col.id || i} variants={fadeUp} className={`rounded-[2.5rem] p-4 flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glassPanel}`}>
              {/* Image Placeholder */}
              <div className={`w-full aspect-4/3 rounded-3xl ${coverColors[i % coverColors.length]} mb-4 flex items-center justify-center border border-white/60 relative overflow-hidden`}>
                {col.coverImage ? (
                  <img src={col.coverImage} alt={col.name} className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <ImageIcon size={32} className="text-slate-400 opacity-50 relative z-10" />
                )}
                
                <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
                
                <div className="absolute top-4 right-4 z-30">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border ${col.status === 'Active' ? 'bg-white/80 text-emerald-600 border-white' : 'bg-slate-800/80 text-white border-slate-700'}`}>
                    {col.status}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="px-2 pb-2">
                <h3 className="text-lg font-black text-slate-800 mb-1 truncate uppercase">{col.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{col.products?.length || 0} Products</p>
                {col.description && (
                  <p className="text-[10px] text-slate-400 mt-2 truncate">{col.description}</p>
                )}
              </div>

              {/* Hover Actions */}
              <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(col)}
                  className={`flex-1 py-3 rounded-xl flex justify-center items-center ${glassButton}`}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(col.id)}
                  className={`w-12 py-3 rounded-xl flex justify-center items-center text-rose-500 ${glassButton}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CREATE/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">
                  {editingId ? 'Edit Collection' : 'Create Collection'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center hover:rotate-90 transition-all duration-300 ${glassButton}`}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 font-mono">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full rounded-xl px-4 py-3 ${glassInput}`} placeholder="e.g. CORE BASICS" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`w-full rounded-xl px-4 py-3 ${glassInput}`} placeholder="Collection description details..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">Cover Image URL</label>
                  <input type="url" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className={`w-full rounded-xl px-4 py-3 ${glassInput}`} placeholder="https://unsplash.com/..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={`w-full rounded-xl px-4 py-3 cursor-pointer ${glassInput}`}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${glassButton}`}>
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-white hover:bg-slate-900 transition-all">
                    Commit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collections;