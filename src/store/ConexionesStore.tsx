import { create } from "zustand";
import { InsertarConexion, MostrarConexiones, EliminarConexiones, Conexion, ConexionInsert } from "../index";

type ConexionQueryParams = {
  usuario_id: number;
};

interface ConexionesStore {
  isAuth: boolean;
  conexiones: Conexion[] | null;
  parametros?: ConexionQueryParams;
  categoriaItemSelect?: Conexion | null;

  mostrarConexiones: (params: ConexionQueryParams) => Promise<Conexion[] | null>;
  insertarConexion: (c: ConexionInsert) => Promise<void>;
  eliminarConexion: (params: Conexion) => Promise<void>;
}


export const useConexionesStore = create<ConexionesStore>((set, get) => ({
  isAuth: false,
  conexiones: [],
  
  mostrarConexiones: async (p) => {
    const response = await MostrarConexiones({usuario_id: Number(p.usuario_id!)} as Conexion);
    set({
      parametros: p,
      conexiones: response,
      categoriaItemSelect: response?.[0] || null,
    });
    return response;
  },

  insertarConexion: async (c: ConexionInsert) => {
    await InsertarConexion(c);
    const { mostrarConexiones, parametros } = get();
    const nuevas = await mostrarConexiones(parametros!);
    set({ conexiones: nuevas });
  },

  eliminarConexion: async (p: Conexion) => {
    await EliminarConexiones({id: p.id} as Conexion);
    const { mostrarConexiones, parametros } = get();
    const nuevas = await mostrarConexiones(parametros!);
    set({ conexiones: nuevas });
  },
}));
