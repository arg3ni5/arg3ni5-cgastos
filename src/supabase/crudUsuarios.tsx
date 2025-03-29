import Swal from "sweetalert2";
import { supabase, ObtenerIdAuthSupabase } from "../index";
import { Database } from "../types/supabase";

type Usuario = Database["public"]["Tables"]["usuarios"]["Row"];
type UsuarioInsert = Database["public"]["Tables"]["usuarios"]["Insert"];


export const ConsultarUsuario = async (
  idAuthSupabase: string | undefined
): Promise<{ data: Usuario | null; error: string | null }> => {
  try {
    if (idAuthSupabase === undefined) {
      idAuthSupabase = await ObtenerIdAuthSupabase();
    }
    if (idAuthSupabase === null || idAuthSupabase === undefined) {
      return { data: null, error: "No se pudo obtener el idAuthSupabase" };
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select()
      .eq("idauth_supabase", idAuthSupabase)
      .maybeSingle();

    return { data, error: error?.message || null };
  } catch (error) {
    console.log(
      "ConsultarUsuario",
      (error as Error).message || "An unknown error occurred"
    );
    return { data: null, error: (error as Error).message };
  }
};


export const InsertarUsuarios = async (p: any, idAuthSupabase: string | undefined) => {
  try {
    const { data: existingUser, error } = await ConsultarUsuario(idAuthSupabase);

    if (!existingUser && !error) {
      const { data: newUser, error: insertError } = await supabase.from("usuarios").insert(p).select().single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return null;
      }

      return newUser;
    }

    console.log("El usuario ya existe en la base de datos");
    return existingUser;

    // const { data: newUser, error: insertError } = await supabase.from("usuarios").insert(p).select().single();
    // return newUser;
  } catch (error) {
    console.log("InsertarUsuarios", (error as any).error_description || (error as Error).message || "An unknown error occurred");
    return null;
  }
};

export const MostrarUsuarios = async () => {
  try {
    console.log("MostrarUsuarios");

    const idAuthSupabase = await ObtenerIdAuthSupabase();
    if (idAuthSupabase === null || idAuthSupabase === undefined) {
      return [];
    }
    const { error, data } = await supabase.from("usuarios").select().eq("idauth_supabase", idAuthSupabase).maybeSingle();
    if (error) {
      console.error("MostrarUsuarios", error);
    }
    if (data) {
      return data;
    }
  } catch (error) {
    alert(((error as any).error_description || (error as Error).message) + "MostrarUsuarios");
  }
};
export async function EditarTemaMonedaUser(p) {
  try {
    console.log("EditarTemaMonedaUser", p);

    const { error } = await supabase.from("usuarios").update(p).eq("id", p.id);
    if (error) {
      alert(`Error al editar usuarios: ${error.message}`);
    }
    Swal.fire({
      icon: "success",
      title: "Datos modificados",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    alert(((error as any).error_description || (error as Error).message) + "EditarTemaMonedaUser");
  }
}
