import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/content';

const useContentStore = create((set) => ({
  content: null,
  isLoading: false,
  error: null,

  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(API_URL);
      set({ content: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useContentStore;
