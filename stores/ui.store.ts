import { create } from 'zustand';
import { UserRole } from '@/types/database.types';

export type ThemeMode = 'imprint' | 'dark';

interface UIState {
  sidebarOpen: boolean;
  commandMenuOpen: boolean;
  activeRole: UserRole;
  activeWarehouseId: string;
  themeMode: ThemeMode;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandMenuOpen: (open: boolean) => void;
  toggleCommandMenu: () => void;
  setActiveRole: (role: UserRole) => void;
  setActiveWarehouseId: (id: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aria_wms_theme');
    if (saved === 'dark' || saved === 'imprint') return saved as ThemeMode;
  }
  return 'imprint';
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandMenuOpen: false,
  activeRole: 'admin',
  activeWarehouseId: 'wh-001',
  themeMode: getInitialTheme(),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
  toggleCommandMenu: () => set((state) => ({ commandMenuOpen: !state.commandMenuOpen })),
  setActiveRole: (role) => set({ activeRole: role }),
  setActiveWarehouseId: (id) => set({ activeWarehouseId: id }),
  setThemeMode: (mode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aria_wms_theme', mode);
    }
    set({ themeMode: mode });
  },
  toggleThemeMode: () =>
    set((state) => {
      const nextTheme = state.themeMode === 'imprint' ? 'dark' : 'imprint';
      if (typeof window !== 'undefined') {
        localStorage.setItem('aria_wms_theme', nextTheme);
      }
      return { themeMode: nextTheme };
    }),
}));
