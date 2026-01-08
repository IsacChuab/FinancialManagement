import { create } from 'zustand';

type Theme = {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
};

export const useTheme = create<Theme>((set) => ({
  mode: 'light' as 'light' | 'dark',

  setMode: (mode: 'light' | 'dark') => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(mode);

    localStorage.setItem('theme', mode);

    set({ mode });
  },
}));
