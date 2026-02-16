import { supabase } from "../index";
import { ObtenerIdAuthSupabase } from "./authHelpers";
import { Database } from "../types/supabase";
import { usuarioInsertSchema, usuarioUpdateSchema } from "../schemas/usuario.schema";
import { logger } from "../utils/logger";
import { showErrorMessage } from "../utils/messages";
import { z } from "zod";

export type Usuario = Database["public"]["Tables"]["usuarios"]["Row"];
export type UsuarioInsert = Database["public"]["Tables"]["usuarios"]["Insert"];
export type UsuarioUpdate = Database["public"]["Tables"]["usuarios"]["Update"];

/**
 * Inserta un usuario si no existe.
 */
export const InsertarUsuarios = async (
  p: UsuarioInsert,
  idAuthSupabase?: string
): Promise<Usuario | null> => {
  try {
    const { data: existingUser, error } = await ConsultarUsuario(idAuthSupabase);

    if (!existingUser && !error) {
      // Validate data before inserting
      const validatedData = usuarioInsertSchema.parse(p);
      
      const { data: newUser, error: insertError } = await supabase
        .from("usuarios")
        .insert(validatedData)
        .select()
        .single();

      if (insertError) {
        logger.error('Error al insertar usuario', { error: insertError, usuario: p });
        showErrorMessage('No se pudo crear el usuario. Por favor, intenta nuevamente.');
        return null;
      }

      logger.info('Usuario creado exitosamente', { userId: newUser.id });
      return newUser;
    }

    return existingUser;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      logger.error('Error de validación al insertar usuario', { error: errorMessage, usuario: p });
      showErrorMessage(`Datos inválidos: ${errorMessage}`);
    } else {
      logger.error('Error al insertar usuario', { error, usuario: p });
      showErrorMessage('No se pudo crear el usuario. Por favor, intenta nuevamente.');
    }
    return null;
  }
};


/**
 * Edita el tema o moneda de un usuario.
 */
export const editarTemaMonedaUser = async (
  p: Partial<Usuario> & { id: number }
): Promise<void> => {
  try {
    // Validate data before updating
    const validatedData = usuarioUpdateSchema.parse(p);
    
    const { error } = await supabase.from("usuarios").update(validatedData).eq("id", p.id);
    
    if (error) throw error;
    logger.info('Usuario actualizado exitosamente', { userId: p.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      logger.error('Error de validación al editar usuario', { error: errorMessage, userId: p.id });
      showErrorMessage(`Datos inválidos: ${errorMessage}`);
    } else {
      logger.error('Error al editar usuario', { error, userId: p.id });
      showErrorMessage('No se pudo actualizar el usuario. Por favor, intenta nuevamente.');
    }
    throw error;
  }
};


/**
 * Consulta un usuario por su ID auth.
 */
export const ConsultarUsuario = async (
  idAuthSupabase?: string
): Promise<{ data: Usuario | null; error: string | null }> => {
  try {
    if (!idAuthSupabase) {
      const authId = await ObtenerIdAuthSupabase();
      idAuthSupabase = authId ?? undefined;
    }

    if (!idAuthSupabase) {
      logger.warn('No se pudo obtener el idAuthSupabase para consultar usuario');
      return { data: null, error: "No se pudo obtener el idAuthSupabase" };
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select()
      .eq("idauth_supabase", idAuthSupabase)
      .maybeSingle();

    if (error) {
      logger.error('Error al consultar usuario', { error, idAuthSupabase });
    }

    return { data, error: error?.message || null };
  } catch (error) {
    logger.error('Error inesperado al consultar usuario', { error, idAuthSupabase });
    return { data: null, error: (error as Error).message };
  }
};
