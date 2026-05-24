import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import AdminLayout from './pages/admin/AdminLayout';
import Orders from './pages/admin/Orders';
import Collections from './pages/admin/Collections';
import Customers from './pages/admin/Customers';

// Auth Pages
import Login from './pages/Login';

// Components for Universal Store Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CustomCursor from './components/CustomCursor';
import { useState, useEffect } from 'react';
import useThemeStore from './store/useThemeStore';

// Customer Pages
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';

function StoreLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <div className="relative">
      <Navbar toggleCart={() => setIsCartOpen(true)} />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <CustomCursor />
      <Routes>
        
        {/* === CUSTOMER / PUBLIC ROUTES === */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
        </Route>

        {/* === LOGIN ROUTE (Distraction-free, no Navbar) === */}
        <Route path="/login" element={<Login />} />

        {/* === ADMIN ROUTES (Sidebar Layout) === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="collections" element={<Collections />} />
          <Route path="customers" element={<Customers />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
