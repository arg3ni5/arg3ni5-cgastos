import { create } from "zustand";
import { editarTemaMonedaUser, ConsultarUsuario, Usuario } from "../index";

type UsuarioUpdate = Partial<Omit<Usuario, "id">> & { id: number };
interface UsuariosStore {
  usuario: Usuario | null;
  idusuario: number;
  setUsuario: (u: Usuario) => void;
  clearUsuario: () => void;
  editartemamonedauser: (p: UsuarioUpdate) => Promise<void>;
  ObtenerUsuarioActual: () => Promise<Usuario>;
}

export const useUsuariosStore = create<UsuariosStore>((set) => ({
  usuario: JSON.parse(localStorage.getItem("usuario") || "null"),
  idusuario: JSON.parse(localStorage.getItem("usuario") || "null")?.id || 0,
  setUsuario: (u) => {
    localStorage.setItem("usuario", JSON.stringify(u));
    set({ usuario: u, idusuario: u.id });
  },
  clearUsuario: () => set({ usuario: null, idusuario: 0 }),

  editartemamonedauser: async (p) => {
    await editarTemaMonedaUser(p);
    // Refrescar datos después del update
    const { data: nuevoUsuario } = await ConsultarUsuario();
    if (nuevoUsuario) {
      set({
        usuario: nuevoUsuario,
        idusuario: nuevoUsuario.id,
      });
    }
  },
  ObtenerUsuarioActual: async () => {
    if (localStorage.getItem("usuario")) {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
      return usuario;
    }
    const { data, error } = await ConsultarUsuario();
    if (error) {
      throw new Error(`Error al obtener usuario actual: ${error}`);
    }
    if (!data) {
      throw new Error("Usuario no encontrado");
    }
    set({ usuario: data, idusuario: data.id });
    return data;
  }
}));

