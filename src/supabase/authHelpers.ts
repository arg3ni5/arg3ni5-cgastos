import { supabase } from "../index";
import { Session, User } from "@supabase/supabase-js";
import { logger } from "../utils/logger";

/**
 * Obtiene la sesión actual.
 */
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      logger.error('Error al obtener sesión', { error });
      return null;
    }
    return data.session;
  } catch (error) {
    logger.error('Error inesperado al obtener sesión', { error });
    return null;
  }
};

/**
 * Verifica si el usuario está autenticado.
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const session = await getSession();
    return session !== null;
  } catch (error) {
    logger.error('Error al verificar autenticación', { error });
    return false;
  }
};

/**
 * Obtiene el ID del usuario autenticado.
 */
export const ObtenerIdAuthSupabase = async (): Promise<string | null> => {
  try {
    const session = await getSession();
    const userId = session?.user?.id ?? null;
    
    if (!userId) {
      logger.warn('No se pudo obtener el ID del usuario autenticado');
    }
    
    return userId;
  } catch (error) {
    logger.error('Error al obtener ID del usuario autenticado', { error });
    return null;
  }
};

/**
 * Obtiene el usuario de Supabase.
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const session = await getSession();
    return session?.user ?? null;
  } catch (error) {
    logger.error('Error al obtener usuario', { error });
    return null;
  }
};

/**
 * Obtiene los metadatos del usuario (name, picture, etc.).
 */
export const getUserMetadata = async (): Promise<Record<string, unknown> | null> => {
  try {
    const user = await getUser();
    return user?.user_metadata ?? null;
  } catch (error) {
    logger.error('Error al obtener metadatos del usuario', { error });
    return null;
  }
};