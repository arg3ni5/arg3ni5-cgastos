import { supabase } from "../index";
import { Database } from "../types/supabase";

type Cuenta = Database["public"]["Tables"]["cuenta"]["Row"];

interface Params {
  idusuario: number;
}
export async function MostrarCuentas(p: Params): Promise<Cuenta | null> {
  try {
    const { data } = await supabase
      .from("cuenta")
      .select()
      .eq("idusuario", p.idusuario)
      .maybeSingle();
    if (data) {
      return data;
    }
    return data;
  } catch (error) { return null; }
}
