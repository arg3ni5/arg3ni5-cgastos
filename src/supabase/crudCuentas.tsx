import { Database, supabase } from "../index";

export type Cuenta = Database["public"]["Tables"]["cuenta"]["Row"];
export type CuentaInsert = Database["public"]["Tables"]["cuenta"]["Insert"];
export type CuentaUpdate = Database["public"]["Tables"]["cuenta"]["Update"];
export interface CuentasQueryParams {
  idusuario: number;
  tipo: string;
}

export async function MostrarCuentas(p: Cuenta): Promise<Cuenta[] | null> {
  try {
    if (!p.idusuario) {
      throw new Error("ID usuario is required");
    }
    const { data } = p.tipo ?
      await supabase
        .from("cuenta")
        .select()
        .eq("tipo", p.tipo)
        .eq("idusuario", p.idusuario) :
      await supabase
        .from("cuenta")
        .select()
        .eq("idusuario", p.idusuario);
    if (data) {
      return data;
    }
    return data;
  } catch (error) { return null; }
}

export async function InsertarCuenta(cuenta: CuentaInsert): Promise<Cuenta | null> {
  try {
    const { data, error } = await supabase
      .from("cuenta")
      .insert(cuenta)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return null;
  }
}

export async function ActualizarCuenta(id: number, cuenta: CuentaUpdate): Promise<Cuenta | null> {
  try {
    const { data, error } = await supabase
      .from("cuenta")
      .update(cuenta)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return null;
  }
}

export async function EliminarCuenta(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("cuenta")
      .delete()
      .eq('id', id);

    return !error;
  } catch (error) {
    return false;
  }
}
