import { create } from 'zustand';
import axios from 'axios';

const API_URL_PRODUCTS = 'http://localhost:5000/api/products';
const API_URL_COLLECTIONS = 'http://localhost:5000/api/collections';

const useProductStore = create((set, get) => ({
  products: [],
  collections: [],
  isLoading: false,
  error: null,

  fetchProducts: async (keyword = '', collectionId = '') => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams();
      if (keyword) query.append('keyword', keyword);
      if (collectionId) query.append('collectionId', collectionId);

      const { data } = await axios.get(`${API_URL_PRODUCTS}?${query.toString()}`);
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCollections: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(API_URL_COLLECTIONS);
      set({ collections: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useProductStore;
