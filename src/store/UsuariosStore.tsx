import { create } from "zustand";
import { editarTemaMonedaUser, obtenerUsuarioActual, Usuario } from "../index";

type UsuarioUpdate = Partial<Omit<Usuario, "id">> & { id: number };
interface UsuariosStore {
  usuario: Usuario | null;
  idusuario: number;
  setUsuario: (u: Usuario) => void;
  clearUsuario: () => void;
  editartemamonedauser: (p: UsuarioUpdate) => Promise<void>;
}

export const useUsuariosStore = create<UsuariosStore>((set) => ({
  usuario: null,
  idusuario: 0,
  setUsuario: (u) => set({ usuario: u, idusuario: u.id }),
  clearUsuario: () => set({ usuario: null, idusuario: 0 }),

  editartemamonedauser: async (p) => {
    await editarTemaMonedaUser(p);
    // Refrescar datos después del update
    const nuevoUsuario = await obtenerUsuarioActual();
    set({
      usuario: nuevoUsuario,
      idusuario: nuevoUsuario.id,
    });
  },
}));

