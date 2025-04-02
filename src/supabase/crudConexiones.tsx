import { Database, supabase } from "../index";
import Swal from "sweetalert2";

export type Conexion = Database["public"]["Tables"]["conexiones_usuarios"]["Row"];

export async function InsertarConexion(c: Conexion) {
  try {
    const { data, error } = await supabase.from("conexiones_usuarios").insert(c).select();
    console.error("error", error);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya existe un registro con " + c.canal_username,
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
    alert(((error as any).error_description || (error as any).message) + " insertar conexion");
  }
}

export const MostrarConexiones = async (c: Conexion): Promise<Conexion[] | null> => {
  try {
    const { data, error } = await supabase
      .from("conexiones_usuarios")
      .select()
      .eq("usuario_id", c.usuario_id);

    if (error) {
      console.error("Error al obtener conexiones:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Excepción en MostrarConexiones:", error);
    return null;
  }
};

export async function EliminarConexiones(c: Conexion) {
  try {
    const { error } = await supabase.from("conexiones_usuarios").delete().eq("id", c.id);

    if (error) throw error;
  } catch (error) {
    console.error("Error al eliminar conexión:", (error as Error).message);
    throw error; // importante para que pueda capturarse si algo falla
  }
}
