import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: true,
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDarkMode;
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newTheme };
  }),
  setTheme: (isDark) => set(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: isDark };
  }),
}));

export default useThemeStore;
