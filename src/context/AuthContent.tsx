import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, InsertarUsuarios, Database } from "../index";

type UsuarioInsert = Database["public"]["Tables"]["usuarios"]["Insert"];

interface AuthContextType {
  user: { name: string; picture: string } | null;
  loading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        const metadata = session.user.user_metadata;
        const user = {
          name: metadata.name,
          idauth_supabase: session.user.id,
          picture: metadata.picture,
        };

        setUser(user);
        await insertarUsuarios(user, session.user.id);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const insertarUsuarios = async (
    dataProvider: { name: string; picture: string },
    idAuthSupabase: string
  ) => {
    const p: UsuarioInsert = {
      nombres: dataProvider.name,
      foto: dataProvider.picture,
      idauth_supabase: idAuthSupabase,
    };

    await InsertarUsuarios(p, idAuthSupabase);
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within an AuthContextProvider");
  }
  return context;
};

