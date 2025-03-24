import Swal from "sweetalert2";
import { supabase, ObtenerIdAuthSupabase } from "../index";

export const ConsultarUsuario = async (idAuthSupabase) => {
  try {
    return supabase.from("usuarios").select().eq("idauth_supabase", idAuthSupabase).single();
  } catch (error) {
    console.log("ConsultarUsuario", error.error_description || error.message);
    return { data: null, error: error };
  }
};

export const InsertarUsuarios = async (p, idAuthSupabase) => {
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
    return newUser;
  } catch (error) {
    console.log("InsertarUsuarios", error.error_description || error.message);
    return null;
  }
};

export const MostrarUsuarios = async () => {
  try {
    const idAuthSupabase = await ObtenerIdAuthSupabase();
    console.log("MostrarUsuarios", idAuthSupabase);

    const { error, data } = await supabase.from("usuarios").select().eq("idauth_supabase", idAuthSupabase).maybeSingle();
    if (error) {
      console.error("MostrarUsuarios", error);
    }
    if (data) {
      return data;
    }
  } catch (error) {
    alert(error.error_description || error.message + "MostrarUsuarios");
  }
};
export async function EditarTemaMonedaUser(p) {
  try {
    console.log("EditarTemaMonedaUser", p);

    const { error } = await supabase.from("usuarios").update(p).eq("id", p.id);
    if (error) {
      alert("Error al editar usuarios", error);
    }
    Swal.fire({
      icon: "success",
      title: "Datos modificados",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    alert(error.error_description || error.message + "EditarTemaMonedaUser");
  }
}
