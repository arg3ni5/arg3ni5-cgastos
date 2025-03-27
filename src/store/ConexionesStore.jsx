import { create } from "zustand";
import { InsertarConexion, MostrarConexiones, EliminarConexiones } from "../index";
export const useConexionesStore = create((set) => ({
  isAuth: false,
  conexiones: [],
  mostrarConexiones: async (p) => {
    const response = await MostrarConexiones(p);
    set({ parametros: p });
    set({ conexiones: response });
    set({ categoriaItemSelect: response[0] });
    return response;
  },
  insertarConexion: async (p) => {
    await InsertarConexion(p);
    const { mostrarConexiones } = get();
    const { parametros } = get();
    set(mostrarConexiones(parametros));
  },
  eliminarConexion: async (p) => {
    await EliminarConexiones(p);
    const { mostrarConexiones, parametros } = get();
    const nuevas = await mostrarConexiones(parametros);
    set({ conexiones: nuevas });
  }

}));
