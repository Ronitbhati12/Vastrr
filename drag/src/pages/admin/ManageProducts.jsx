import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Image as ImageIcon, Upload, X, 
  ArrowUpRight, Search, SlidersHorizontal, PackageOpen
} from 'lucide-react';
import { useProduct } from '../../context/ProductContext';
import useProductStore from '../../store/useProductStore';

const ManageProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const { collections, fetchCollections } = useProductStore();
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isDragging, setIsDragging] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', material: '', price: '', discountRate: '', image: '', color: 'bg-[#F1F5F9]', collectionId: ''
  });
  const [uploadMode, setUploadMode] = useState('url');

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Soft pastel colors that look great under glass
  const studioColors = useMemo(() => [
    'bg-[#F8FAFC]', 'bg-[#F1F5F9]', 'bg-[#EEF2FF]', 'bg-[#F5F3FF]',
    'bg-[#FAF5FF]', 'bg-[#FFF1F2]', 'bg-[#FFF7ED]', 'bg-[#F0FDF4]'
  ], []);

  // --- Handlers ---
  const handleOpenModal = useCallback((product = null) => {
    if (product) {
      setFormData({ 
        ...product, 
        color: product.colorCode || product.color || 'bg-[#F1F5F9]',
        collectionId: product.collectionId?.toString() || ''
      });
      setEditingId(product.id);
    } else {
      setFormData({
        name: '', material: '', price: '', discountRate: '', image: '', 
        color: studioColors[Math.floor(Math.random() * studioColors.length)],
        collectionId: collections[0]?.id?.toString() || ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  }, [studioColors, collections]);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      material: formData.material,
      price: Number(formData.price),
      discountRate: Number(formData.discountRate) || 0,
      image: formData.image,
      colorCode: formData.color,
      collectionId: parseInt(formData.collectionId)
    };
    
    if (editingId) updateProduct(editingId, payload);
    else addProduct(payload);
    
    setIsModalOpen(false);
  };

  // --- Advanced Filtering & Sorting ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = products?.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    switch (sortBy) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'discount': return result.sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0));
      default: return result.reverse(); 
    }
  }, [products, searchTerm, sortBy]);

  // --- Formatting ---
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  // Shared Glass Morphism Classes
  const glassPanel = "bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]";
  const glassInput = "bg-[var(--theme-card)]0 backdrop-blur-md border border-white/60 focus:bg-white/80 focus:ring-4 focus:ring-white/50 shadow-inner";
  const glassButton = "bg-white/60 backdrop-blur-md border border-white/80 hover:bg-white/90 shadow-[0_4px_15px_0_rgba(0,0,0,0.05)] text-slate-800";

  return (
    <div className="relative min-h-screen p-6 md:p-12 lg:p-16 overflow-y-auto pb-20 selection:bg-slate-800 selection:text-white text-slate-800">
      
      {/* AMBIENT BACKGROUND BLOBS FOR GLASS REFRACTION */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-slate-50 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-200/50 mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-200/50 mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-rose-200/40 mix-blend-multiply filter blur-[80px] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <div className="relative z-10 space-y-10">
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex flex-col xl:flex-row justify-between items-start xl:items-end border-b border-slate-300/30 pb-10 gap-8"
        >
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-800 leading-[0.85] drop-shadow-sm">
              Product <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-800 via-slate-500 to-slate-400">Archive.</span>
            </h1>
            <div className="flex items-center gap-4 mt-6">
              <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${glassPanel}`}>
                {filteredAndSortedProducts.length} Items
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Active Inventory
              </p>
            </div>
          </div>
          
          {/* ACTION BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative group flex-1 xl:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors z-10" size={16} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-[1.25rem] pl-11 pr-4 py-4 text-xs font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 ${glassInput}`}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none rounded-[1.25rem] pl-12 pr-10 py-4 text-xs font-bold uppercase tracking-wider text-slate-800 focus:outline-none transition-all cursor-pointer ${glassInput}`}
              >
                <option value="newest">Newest First</option>
                <option value="price-desc">Price: High - Low</option>
                <option value="price-asc">Price: Low - High</option>
                <option value="discount">Highest Discount</option>
              </select>
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
            </div>

            <button 
              onClick={() => handleOpenModal()}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase bg-slate-800/90 backdrop-blur-md hover:bg-slate-900 rounded-[1.25rem] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_15px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.4)] border border-slate-700"
            >
              <span className="relative flex items-center gap-2">
                <Plus size={16} /> New Product
              </span>
            </button>
          </div>
        </motion.div>

        {/* PRODUCTS GRID */}
        {filteredAndSortedProducts.length > 0 ? (
          <motion.div 
            variants={containerVariants} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product) => (
                <motion.div 
                  layout
                  key={product.id} variants={itemVariants} exit="exit"
                  className={`group relative flex flex-col p-4 rounded-4xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(31,38,135,0.15)] ${glassPanel}`}
                >
                  {/* Image/Color Box */}
                  <div 
                    style={product.colorCode && product.colorCode.startsWith('#') ? { backgroundColor: product.colorCode } : {}}
                    className={`relative w-full aspect-4/5 ${(!product.colorCode || !product.colorCode.startsWith('#')) ? (product.color || 'bg-slate-100') : ''} rounded-3xl overflow-hidden mb-5 flex items-center justify-center shadow-inner`}
                  >
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 ease-out group-hover:scale-110" />
                    ) : (
                      <ImageIcon size={48} className="text-slate-300 relative z-10" />
                    )}
                    
                    {product.discountRate > 0 && (
                      <div className={`absolute top-4 right-4 text-slate-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-30 ${glassButton}`}>
                        -{product.discountRate}%
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-[2px]" />

                    {/* Action Buttons */}
                    <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3 z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${glassButton}`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-rose-500 hover:text-rose-600 transition-transform hover:scale-110 ${glassButton}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-col px-2 pb-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-base font-black text-slate-800 uppercase tracking-tight leading-tight truncate">{product.name}</h3>
                      <p className="text-base font-black text-slate-800 whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold mt-1.5 uppercase tracking-widest truncate">
                      {product.material || "Standard Material"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center justify-center py-32 text-center rounded-[3rem] ${glassPanel}`}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-slate-400 mb-6 ${glassButton}`}>
              <PackageOpen size={40} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-2">No Products Found</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 max-w-md">
              {searchTerm ? `We couldn't find anything matching "${searchTerm}". Try adjusting your filters.` : "Your inventory is currently empty. Start by adding a new product above."}
            </p>
          </motion.div>
        )}
      </div>

      {/* ULTRA PREMIUM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-4xl md:rounded-[3rem] w-full max-w-5xl shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] relative z-10 flex flex-col md:flex-row h-auto max-h-full overflow-hidden"
            >
              {/* Left Side: Visual Preview */}
              <div 
                style={formData.color && formData.color.startsWith('#') ? { backgroundColor: formData.color } : {}}
                className={`hidden md:flex w-2/5 ${(!formData.color || !formData.color.startsWith('#')) ? formData.color : ''} relative items-center justify-center p-6 md:p-10 border-r border-white/40`}
              >
                 <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                 {formData.image ? (
                   <motion.img 
                     initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                     src={formData.image} alt="Preview" 
                     className="relative z-10 w-full h-full object-cover rounded-4xl shadow-2xl" 
                   />
                 ) : (
                   <div className="text-slate-400 flex flex-col items-center relative z-10">
                     <ImageIcon size={72} className="mb-4 drop-shadow-sm opacity-50" />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Canvas Preview</p>
                   </div>
                 )}
                 <div className="absolute top-8 left-8 z-20">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-slate-800 ${glassButton}`}>
                     <ArrowUpRight size={20} />
                   </div>
                 </div>
              </div>

              {/* Right Side: Form */}
              <div className="w-full md:w-3/5 p-8 md:p-14 overflow-y-auto">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-800">
                    {editingId ? 'Edit Item' : 'Create Item'}
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center hover:rotate-90 transition-all duration-300 ${glassButton}`}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Product Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full rounded-[1.25rem] px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 ${glassInput}`} placeholder="e.g. Heavyweight Hoodie" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Material / Spec</label>
                      <input type="text" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} className={`w-full rounded-[1.25rem] px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 ${glassInput}`} placeholder="e.g. 400GSM French Terry" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Price (₹)</label>
                      <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full rounded-[1.25rem] px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 ${glassInput}`} placeholder="0" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Discount (%)</label>
                      <input type="number" min="0" max="100" value={formData.discountRate} onChange={e => setFormData({...formData, discountRate: e.target.value})} className={`w-full rounded-[1.25rem] px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 ${glassInput}`} placeholder="0" />
                    </div>
                    <div className="space-y-3 col-span-1 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Collection</label>
                      <select 
                        required 
                        value={formData.collectionId} 
                        onChange={e => setFormData({...formData, collectionId: e.target.value})} 
                        className={`w-full rounded-[1.25rem] px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none transition-all cursor-pointer ${glassInput}`}
                      >
                        <option value="" disabled>Select Collection</option>
                        {collections.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Image Upload Box */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Visual Asset</label>
                      <div className={`flex rounded-xl p-1 ${glassInput}`}>
                        <button type="button" onClick={() => setUploadMode('url')} className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${uploadMode === 'url' ? 'bg-white/80 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>URL</button>
                        <button type="button" onClick={() => setUploadMode('local')} className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${uploadMode === 'local' ? 'bg-white/80 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Local</button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {uploadMode === 'url' ? (
                        <motion.input 
                          key="url-input"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                          type="url" 
                          placeholder="https://example.com/image.jpg"
                          value={formData.image} 
                          onChange={e => setFormData({...formData, image: e.target.value})} 
                          className={`w-full rounded-[1.25rem] px-5 py-4 text-sm font-medium text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 ${glassInput}`} 
                        />
                      ) : (
                        <motion.div 
                          key="local-input"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                          className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all group ${
                            isDragging ? 'bg-white/60 border-slate-400 scale-[1.02]' : 'bg-white/30 border-white/60 hover:bg-[var(--theme-card)]0 hover:border-slate-300'
                          }`}
                        >
                          <input type="file" accept="image/*" onChange={(e) => processFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 ${isDragging ? 'bg-slate-800 text-white scale-110' : `text-slate-700 group-hover:-translate-y-1 ${glassButton}`}`}>
                            <Upload size={20} />
                          </div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-800 mb-1">
                            {isDragging ? 'Drop Image Now' : 'Drag & Drop Asset'}
                          </p>
                          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">or click to browse files</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className={`flex-1 px-6 py-5 rounded-[1.25rem] text-[11px] font-bold uppercase tracking-widest transition-colors ${glassButton}`}>
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-6 py-5 rounded-[1.25rem] text-[11px] font-bold uppercase tracking-widest bg-slate-800/90 backdrop-blur-md text-white border border-slate-700 hover:bg-slate-900 transition-all hover:shadow-[0_15px_30px_-10px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-0">
                      Commit Item
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;