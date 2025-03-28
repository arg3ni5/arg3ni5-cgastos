import { supabase } from "../index";
import Swal from "sweetalert2";
export async function InsertarConexion(p) {
  try {
    const { data, error } = await supabase.from("conexiones_usuarios").insert(p).select();
    console.error("error", error);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya existe un registro con " + p.canal_username,
        footer: '<a href="">Agregue una nueva descripcion</a>',
      });
    }
    if (data) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Datos guardados",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    return data;
  } catch (error) {
    alert(error.error_description || error.message + " insertar conexion");
  }
}
export async function MostrarConexiones(p) {
  try {
    const { data } = await supabase.from("conexiones_usuarios").select().eq("usuario_id", p.usuario_id);

    if (data) {
      return data;
    }
    return data;
  } catch (error) {}
}
export async function EliminarConexiones(p) {
  try {
    console.log("EliminarConexiones", p);

    const { error } = await supabase.from("conexiones_usuarios").delete().eq("id", p.id);

    if (error) throw error;
  } catch (error) {
    console.error("Error al eliminar conexión:", error.message);
    throw error; // importante para que pueda capturarse si algo falla
  }
}
