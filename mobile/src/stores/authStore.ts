import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { TOKEN_KEY } from '../api/client';

type AuthState = {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  loadToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: async (token) => {
    set({ token });
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },
  loadToken: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    set({ token });
  },
}));
