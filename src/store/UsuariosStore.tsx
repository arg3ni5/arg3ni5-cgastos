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
  clearUsuario: () => {
    localStorage.removeItem("usuario");
    set({ usuario: null, idusuario: 0 });
  },
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
    // 1. Intentar leer desde localStorage
    const stored = localStorage.getItem("usuario");

    if (stored) {
      const usuario: Usuario = JSON.parse(stored);

      // Validar que el usuario local sea usable
      if (usuario?.id && usuario?.idauth_supabase) {
        set({ usuario, idusuario: usuario.id });
        return usuario;
      }
    }

    // 2. Consultar a Supabase
    const { data, error } = await ConsultarUsuario();

    if (error) {
      throw new Error(`Error al obtener usuario actual: ${error}`);
    }

    if (!data) {
      throw new Error("Usuario no encontrado");
    }

    // 3. Guardar usuario válido en store + localStorage
    localStorage.setItem("usuario", JSON.stringify(data));
    set({ usuario: data, idusuario: data.id });

    return data;
  }


}));
