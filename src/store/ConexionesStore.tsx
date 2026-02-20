import { create } from "zustand";
import { InsertarConexion, MostrarConexiones, EliminarConexiones, Conexion, ConexionInsert } from "../index";
import { logger } from "../utils/logger";

type ConexionQueryParams = {
  idusuario: number;
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
    try {
      const response = await MostrarConexiones({idusuario: Number(p.idusuario)} as Conexion);
      set({
        parametros: p,
        conexiones: response,
        categoriaItemSelect: response?.[0] || null,
      });
      logger.debug('Conexiones cargadas exitosamente', { count: response?.length || 0 });
      return response;
    } catch (error) {
      logger.error('Error al mostrar conexiones en store', { error, userId: p.idusuario });
      return null;
    }
  },

  insertarConexion: async (c: ConexionInsert) => {
    try {
      await InsertarConexion(c);
      const { mostrarConexiones, parametros } = get();
      if (parametros) {
        const nuevas = await mostrarConexiones(parametros);
        set({ conexiones: nuevas });
      }
      logger.debug('Conexión insertada y lista refrescada');
    } catch (error) {
      logger.error('Error al insertar conexión en store', { error, conexion: c });
      throw error;
    }
  },

  eliminarConexion: async (p: Conexion) => {
    try {
      await EliminarConexiones({id: p.id} as Conexion);
      const { mostrarConexiones, parametros } = get();
      if (parametros) {
        const nuevas = await mostrarConexiones(parametros);
        set({ conexiones: nuevas });
      }
      logger.debug('Conexión eliminada y lista refrescada', { conexionId: p.id });
    } catch (error) {
      logger.error('Error al eliminar conexión en store', { error, conexionId: p.id });
      throw error;
    }
  },
}));
