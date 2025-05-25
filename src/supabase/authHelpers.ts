import { supabase } from "../index";
import { Session, User } from "@supabase/supabase-js";

/**
 * Obtiene la sesión actual.
 */
export const getSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

/**
 * Verifica si el usuario está autenticado.
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return session !== null;
};

/**
 * Obtiene el ID del usuario autenticado.
 */
export const ObtenerIdAuthSupabase = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.user?.id ?? null;
};

/**
 * Obtiene el usuario de Supabase.
 */
export const getUser = async (): Promise<User | null> => {
  const session = await getSession();
  return session?.user ?? null;
};

/**
 * Obtiene los metadatos del usuario (name, picture, etc.).
 */
export const getUserMetadata = async (): Promise<Record<string, any> | null> => {
  const user = await getUser();
  return user?.user_metadata ?? null;
};