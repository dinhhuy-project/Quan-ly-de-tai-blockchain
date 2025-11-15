import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setOrganization: (org: 'org1' | 'org2') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  setOrganization: (org: 'org1' | 'org2') => {
    set((state) => ({
      user: state.user ? { ...state.user, organization: org } : null,
    }));
  },
}));

// Restore user from localStorage on app start
const storedUser = localStorage.getItem('user');
if (storedUser) {
  try {
    useAuthStore.setState({ user: JSON.parse(storedUser), isAuthenticated: true });
  } catch (error) {
    console.error('Failed to restore user from localStorage:', error);
  }
}
