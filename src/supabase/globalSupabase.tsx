import { supabase } from "../index";
import { Session, User } from "@supabase/supabase-js";

export const ObtenerIdAuthSupabase = async (): Promise<string | null> => {
  const {
    data: { session },
  }: { data: { session: Session | null } } = await supabase.auth.getSession();

  if (session !== null) {
    const user: User = session.user;
    const idAuthSupabase: string = user.id;
    return idAuthSupabase;
  }

  return null;
};
