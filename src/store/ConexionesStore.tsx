import { create } from "zustand";
import { InsertarConexion, MostrarConexiones, EliminarConexiones, Conexion, ConexionInsert, ConexionQueryParams } from "../index";

interface ConexionesStore {
  isAuth: boolean;
  conexiones: Conexion[] | null;
  parametros?: ConexionQueryParams;
  categoriaItemSelect?: Conexion | null;

  mostrarConexiones: (params: ConexionQueryParams) => Promise<Conexion[] | null>;
  insertarConexion: (c: ConexionInsert) => Promise<void>;
  eliminarConexion: (params: ConexionQueryParams) => Promise<void>;
}


export const useConexionesStore = create<ConexionesStore>((set, get) => ({
  isAuth: false,
  conexiones: [],
  
  mostrarConexiones: async (p) => {
    const response = await MostrarConexiones({id: p.usuario_id!} as Conexion);
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

  eliminarConexion: async (p: ConexionQueryParams) => {
    await EliminarConexiones({id: p.usuario_id!} as Conexion);
    const { mostrarConexiones, parametros } = get();
    const nuevas = await mostrarConexiones(parametros!);
    set({ conexiones: nuevas });
  },
}));
