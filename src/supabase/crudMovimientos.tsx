import { Database, supabase } from "../index";
import { showErrorMessage, showSuccessMessage } from "../utils/sweetAlertUtils";

export type Movimiento = Database["public"]["Tables"]["movimientos"]["Row"];
export type MovimientoInsert = Database["public"]["Tables"]["movimientos"]["Insert"];
export type MovimientoUpdate = Database["public"]["Tables"]["movimientos"]["Update"];

export const InsertarMovimientos = async (p: MovimientoInsert): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("movimientos")
      .insert(p)
      .select();
    if (error) {
      showErrorMessage(`Ya existe un registro con ${p.descripcion}`);
    }
    if (data) {
      showSuccessMessage("Registrado");
    }
  } catch (error: any) {
    showErrorMessage(error.error_description || error.message + " insertar movimientos");
  }
};

export const EliminarMovimientos = async (p: Movimiento): Promise<void> => {
  try {
    const { error } = await supabase
      .from("movimientos")
      .delete()
      .eq("id", p.id);
    if (error) {
      showErrorMessage(`Error al eliminar: ${error.message}`);
    }
  } catch (error: any) {
    showErrorMessage(error.error_description || error.message + " eliminar movimientos");
  }
};

export const ActualizarMovimientos = async (p: MovimientoUpdate): Promise<void> => {
  try {
    if (!p.id) {
      showErrorMessage("No se puede actualizar el registro");
      return;
    }
    await supabase
      .from("movimientos")
      .update(p)
      .eq("id", p.id)

  } catch (error: any) {
    showErrorMessage(error.error_description || error.message + " insertar movimientos");
  }
}



export type MovimientosMesAnioParams = Database["public"]["Functions"]["mmovimientosmesanio"]["Args"];
export type MovimientosMesAnio = Database["public"]["Functions"]["mmovimientosmesanio"]["Returns"];

export const MostrarMovimientosPorMesAño = async (p: MovimientosMesAnioParams): Promise<MovimientosMesAnio | null> => {
  try {
    const { data, error } = await supabase.rpc("mmovimientosmesanio", p);
    if (error) {
      showErrorMessage(`Error al mostrar movimientos: ${error.message}`);
      return null;
    }
    return data;
  } catch (error: any) {
    showErrorMessage(error.error_description || error.message + " mostrar movimientos");
    return null;
  }
};

export type RptMovimientosMesAnioParams = Database["public"]["Functions"]["rptmovimientos_anio_mes"]["Args"];
export type RptMovimientosMesAnio = Database["public"]["Functions"]["rptmovimientos_anio_mes"]["Returns"];


export const RptMovimientosPorMesAño = async (p: RptMovimientosMesAnioParams): Promise<RptMovimientosMesAnio | null> => {
  try {
    const { data, error } = await supabase.rpc("rptmovimientos_anio_mes", p);
    if (error) {
      showErrorMessage(`Error al generar reporte: ${error.message}`);
      return null;
    }
    return data;
  } catch (error: any) {
    showErrorMessage(error.error_description || error.message + " reporte movimientos");
    return null;
  }
};


// Add this function after your type definitions and before the other functions
export const convertToMovimiento = (item: MovimientosMesAnio[number]): Movimiento => {
  return {
    id: item.id,
    descripcion: item.descripcion,
    valor: item.valor,
    fecha: item.fecha,
    estado: item.estado

  } as Movimiento;
};
