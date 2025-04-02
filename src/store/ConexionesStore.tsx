import { create } from "zustand";
import { InsertarConexion, MostrarConexiones, EliminarConexiones, Conexion } from "../index";


interface ParametrosBusqueda {
  usuario_id: number | undefined;
  // otros posibles filtros
}

interface ConexionesStore {
  isAuth: boolean;
  conexiones: Conexion[] | null;
  parametros?: ParametrosBusqueda;
  categoriaItemSelect?: Conexion | null;

  mostrarConexiones: (params: ParametrosBusqueda) => Promise<Conexion[] | null>;
  insertarConexion: (c: Conexion) => Promise<void>;
  eliminarConexion: (params: ParametrosBusqueda) => Promise<void>;
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

  insertarConexion: async (c: Conexion) => {
    await InsertarConexion(c);
    const { mostrarConexiones, parametros } = get();
    const nuevas = await mostrarConexiones(parametros!);
    set({ conexiones: nuevas });
  },

  eliminarConexion: async (p: ParametrosBusqueda) => {
    await EliminarConexiones({id: p.usuario_id!} as Conexion);
    const { mostrarConexiones, parametros } = get();
    const nuevas = await mostrarConexiones(parametros!);
    set({ conexiones: nuevas });
  },
}));
