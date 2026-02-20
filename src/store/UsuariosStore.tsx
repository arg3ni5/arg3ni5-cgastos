import { create } from "zustand";
import { editarTemaMonedaUser, ConsultarUsuario, Usuario } from "../index";
import { secureStorage, SessionManager } from "../utils/encryption";
import { logger } from "../utils/logger";
import { env } from "../config/env";

type UsuarioUpdate = Partial<Omit<Usuario, "id">> & { id: number };

interface UsuariosStore {
  usuario: Usuario | null;
  idusuario: number;
  setUsuario: (u: Usuario) => void;
  clearUsuario: () => void;
  editartemamonedauser: (p: UsuarioUpdate) => Promise<void>;
  ObtenerUsuarioActual: () => Promise<Usuario>;
}

const USUARIO_STORAGE_KEY = 'usuario';
const SESSION_TIMEOUT = env.VITE_SESSION_TIMEOUT;

export const useUsuariosStore = create<UsuariosStore>((set) => ({
  usuario: (() => {
    try {
      // Try to get user from secure storage with expiry check
      const stored = SessionManager.getWithExpiry<Usuario>(USUARIO_STORAGE_KEY);
      if (stored) {
        logger.debug('Usuario cargado desde almacenamiento seguro', { userId: stored.id });
        return stored;
      }
    } catch (error) {
      logger.error('Error al cargar usuario desde storage', { error });
    }
    return null;
  })(),
  
  idusuario: (() => {
    try {
      const stored = SessionManager.getWithExpiry<Usuario>(USUARIO_STORAGE_KEY);
      return stored?.id || 0;
    } catch (error) {
      return 0;
    }
  })(),
  
  setUsuario: (u) => {
    try {
      // Store with session expiration
      SessionManager.setWithExpiry(USUARIO_STORAGE_KEY, u, SESSION_TIMEOUT);
      set({ usuario: u, idusuario: u.id });
      logger.debug('Usuario guardado en storage', { userId: u.id });
    } catch (error) {
      logger.error('Error al guardar usuario en storage', { error, userId: u.id });
      // Fallback to setting in state only
      set({ usuario: u, idusuario: u.id });
    }
  },
  
  clearUsuario: () => {
    try {
      secureStorage.removeItem(USUARIO_STORAGE_KEY);
      set({ usuario: null, idusuario: 0 });
      logger.debug('Usuario eliminado del storage');
    } catch (error) {
      logger.error('Error al limpiar usuario del storage', { error });
      // Still clear state even if storage fails
      set({ usuario: null, idusuario: 0 });
    }
  },
  
  editartemamonedauser: async (p) => {
    try {
      await editarTemaMonedaUser(p);
      // Refrescar datos después del update
      const { data: nuevoUsuario } = await ConsultarUsuario();
      if (nuevoUsuario) {
        SessionManager.setWithExpiry(USUARIO_STORAGE_KEY, nuevoUsuario, SESSION_TIMEOUT);
        set({
          usuario: nuevoUsuario,
          idusuario: nuevoUsuario.id,
        });
        logger.info('Tema/moneda actualizado exitosamente', { userId: nuevoUsuario.id });
      }
    } catch (error) {
      logger.error('Error al actualizar tema/moneda del usuario', { error, userId: p.id });
      throw error;
    }
  },
  
  ObtenerUsuarioActual: async () => {
    try {
      // 1. Intentar leer desde localStorage con validación de expiración
      const stored = SessionManager.getWithExpiry<Usuario>(USUARIO_STORAGE_KEY);

      if (stored) {
        // Validar que el usuario local sea usable
        if (stored.id && stored.idauth_supabase) {
          // Refresh session timestamp
          SessionManager.refreshSession(USUARIO_STORAGE_KEY);
          set({ usuario: stored, idusuario: stored.id });
          logger.debug('Usuario obtenido desde storage', { userId: stored.id });
          return stored;
        }
      }

      // 2. Consultar a Supabase
      logger.debug('Consultando usuario desde Supabase');
      const { data, error } = await ConsultarUsuario();

      if (error) {
        logger.error('Error al obtener usuario actual desde Supabase', { error });
        throw new Error(`Error al obtener usuario actual: ${error}`);
      }

      if (!data) {
        logger.warn('Usuario no encontrado en Supabase');
        throw new Error("Usuario no encontrado");
      }

      // 3. Guardar usuario válido en store + localStorage con expiración
      SessionManager.setWithExpiry(USUARIO_STORAGE_KEY, data, SESSION_TIMEOUT);
      set({ usuario: data, idusuario: data.id });
      logger.info('Usuario obtenido exitosamente desde Supabase', { userId: data.id });

      return data;
    } catch (error) {
      logger.error('Error al obtener usuario actual', { error });
      throw error;
    }
  }
}));
