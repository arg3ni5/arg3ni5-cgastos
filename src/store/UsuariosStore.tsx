import { create } from "zustand";
import { Database, EditarTemaMonedaUser, MostrarUsuarios } from "../index";

type Usuario = Database["public"]["Tables"]["usuarios"]["Row"];
type UsuarioUpdate = Partial<Omit<Usuario, "id">> & { id: number };

interface UsuariosStore {
  idusuario: number;
  datausuarios: Usuario | null;
  mostrarUsuarios: () => Promise<Usuario | null>;
  editartemamonedauser: (p: UsuarioUpdate) => Promise<void>;
}

export const useUsuariosStore = create<UsuariosStore>((set, get) => ({
  idusuario: 0,
  datausuarios: null,

  mostrarUsuarios: async () => {
    const response = await MostrarUsuarios();
    set({ datausuarios: response });

    if (response) {
      set({ idusuario: response.id });
      return response;
    }

    return null;
  },

  editartemamonedauser: async (p) => {
    await EditarTemaMonedaUser(p);
    await get().mostrarUsuarios(); // Refrescar datos después del update
  },
}));

