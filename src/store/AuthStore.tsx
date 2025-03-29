import { create } from "zustand";
import { supabase } from "../index";

interface AuthStore {
  isAuth: boolean;
  datauserGoogle: any[]; // mejorá si sabés qué estructura tiene
  signInWithGoogle: () => Promise<{ provider: string; url: string } | undefined>;
  signout: () => Promise<void>;
}


export const useAuthStore = create<AuthStore>((set) => ({
  isAuth: false,
  datauserGoogle: [],

  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw new Error("Ocurrió un error durante la autenticación");
      set({ isAuth: true });
      return data;
    } catch (error) {
      console.error("signInWithGoogle:", (error as Error).message);
    }
  },

  signout: async () => {
    const { error } = await supabase.auth.signOut();
    set({ isAuth: false });
    if (error) {
      console.error("signout:", error.message);
      throw new Error("Ocurrió un error durante el cierre de sesión");
    }
  },
}));
