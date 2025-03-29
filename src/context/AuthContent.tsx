import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, InsertarUsuarios, Database } from "../index";

// Tipar fila de la tabla usuarios
type UsuarioInsert = Database["public"]["Tables"]["usuarios"]["Insert"];

// Tipar lo que se guarda como usuario en el contexto (metadata o null)
interface AuthContextType {
  user: { name: string; picture: string } | null;
}

// Crear contexto con valor inicial `undefined` para forzar que use el provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tipar props del provider
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session == null) {
          setUser(null);
        } else {
          const metadata = session.user.user_metadata;
          const user = {
            name: metadata.name,
            picture: metadata.picture
          };
          setUser(user);

          await insertarUsuarios(user, session.user.id);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe(); // 👈 importante: cancelar el listener
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
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook tipado
export const useUserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within an AuthContextProvider");
  }
  return context;
};
