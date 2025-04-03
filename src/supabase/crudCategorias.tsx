import { Database, supabase } from "../index";
import Swal from "sweetalert2";

// Add utility function for error messages
const showErrorMessage = (text: string, title: string = "Error") => {
  Swal.fire({
    icon: "error", title, text
  });
};

export type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
export type CategoriaInsert = Database["public"]["Tables"]["categorias"]["Insert"];
export type CategoriaUpdate = Database["public"]["Tables"]["categorias"]["Update"];
export interface CategoriaQueryParams {
  idusuario: number;
  tipo: string;
  id?: number;
}

export const InsertarCategorias = async (p: CategoriaInsert): Promise<void> => {
  try {
    console.log("InsertarCategorias", p);
    
    const { data, error } = await supabase
      .from("categorias")
      .insert(p)
      .select();

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya existe un registro con " + p.descripcion,
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
  } catch (error: any) {
    alert(error.error_description || error.message + " insertar categorias");
  }
};

export const MostrarCategorias = async (p: CategoriaQueryParams): Promise<Categoria[] | null> => {
  try {
    const { data } = await supabase
      .from("categorias")
      .select()
      .eq("idusuario", p.idusuario)
      .eq("tipo", p.tipo)
      .order("id", { ascending: false });
    return data;
  } catch (error) {
    return null;
  }
};

export const EliminarCategorias = async (p: CategoriaQueryParams): Promise<void> => {
  try {
    if (!p.id) {
      showErrorMessage("ID is required");
      throw new Error("ID is required");
    }
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("idusuario", p.idusuario)
      .eq("id", p.id);
    if (error) {
      showErrorMessage(`Error al eliminar: ${error.message}`);
    }
  } catch (error: any) {
    showErrorMessage(error.error_description || error.message + " eliminar categorias");
  }
};

export const EditarCategorias = async (p: CategoriaUpdate): Promise<void> => {
  try {
    if (!p.id) {
      showErrorMessage("ID is required");
      throw new Error("ID is required");
    }
    if (!p.idusuario) {
      showErrorMessage("ID usuario is required");
      throw new Error("ID usuario is required");
    }
    const { error } = await supabase
      .from("categorias")
      .update(p)
      .eq("idusuario", p.idusuario)
      .eq("id", p.id);
    if (error) {
      showErrorMessage(`Error al editar categoria: ${error.message}`);
    }
  } catch (error: any) {
    showErrorMessage(error.error_description || error.message + " editar categorias");
  }
};

export const EliminarCategoriasTodas = async (p: Pick<CategoriaQueryParams, 'idusuario'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("idusuario", p.idusuario);
    if (error) {
      showErrorMessage("Error al eliminar");
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Datos reseteados",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error: any) {
    alert(error.error_description || error.message + " eliminar categorias");
  }
};