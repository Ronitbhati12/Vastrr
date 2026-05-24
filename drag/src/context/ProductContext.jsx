import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

const API_URL = 'http://localhost:5000/api/products';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUserToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo ? userInfo.token : null;
  };

  const getAuthHeaders = () => {
    const token = getUserToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(API_URL);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    try {
      const { data } = await axios.post(API_URL, product, getAuthHeaders());
      await fetchProducts();
      return data;
    } catch (error) {
      console.error("Error adding product: ", error);
      alert(error.response?.data?.message || 'Failed to add product');
      throw error;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, updatedProduct, getAuthHeaders());
      await fetchProducts();
      return data;
    } catch (error) {
      console.error("Error updating product: ", error);
      alert(error.response?.data?.message || 'Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product: ", error);
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, fetchProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
