import { create } from 'zustand';

import { supabase } from '$shared/api';
import { deleteToken, getToken, saveToken } from '$shared/store';

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) console.error(error);

      if (data.session?.access_token) {
        await saveToken(data.session.access_token);
      }

      set({
        user: {
          id: data.user?.id || '',
          email: data.user?.email || '',
          name: data.user?.user_metadata?.full_name,
          avatarUrl: data.user?.user_metadata?.avatar_url,
        },
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();

      await deleteToken();

      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const token = await getToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, loading: false });
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);

      set({
        user: {
          id: data.user?.id || '',
          email: data.user?.email || '',
          name: data.user?.user_metadata?.full_name,
          avatarUrl: data.user?.user_metadata?.avatar_url,
        },
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
