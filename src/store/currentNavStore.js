// src/useStore.js
import { create } from 'zustand';

export const useCurrentNavStore = create((set) => ({
    currentNav: null,
    setNavigation: (nav) => set({ currentNav: nav }),
}));
