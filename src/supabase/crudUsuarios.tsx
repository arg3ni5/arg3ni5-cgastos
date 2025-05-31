import { supabase } from "../index";
import { ObtenerIdAuthSupabase } from "./authHelpers";
import { Database } from "../types/supabase"; // Ajustá el path si es distinto

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
      const { data: newUser, error: insertError } = await supabase
        .from("usuarios")
        .insert(p)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return null;
      }

      return newUser;
    }

    return existingUser;
  } catch (error) {
    console.error("InsertarUsuarios", error);
    return null;
  }
};


/**
 * Edita el tema o moneda de un usuario.
 */
export const editarTemaMonedaUser = async (
  p: Partial<Usuario> & { id: number }
): Promise<void> => {
  const { error } = await supabase.from("usuarios").update(p).eq("id", p.id);
  if (error) {
    throw new Error(`Error al editar usuarios: ${error.message}`);
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
      return { data: null, error: "No se pudo obtener el idAuthSupabase" };
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select()
      .eq("idauth_supabase", idAuthSupabase)
      .maybeSingle();

    return { data, error: error?.message || null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
};
