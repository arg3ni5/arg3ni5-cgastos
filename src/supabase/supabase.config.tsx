import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { env } from "../config/env";

export const supabase = createClient<Database>(
  env.VITE_APP_SUPABASE_URL,
  env.VITE_APP_SUPABASE_ANON_KEY
);
