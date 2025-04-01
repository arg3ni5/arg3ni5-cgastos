import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, InsertarUsuarios, Database } from "../index";
import { useLocation, useNavigate } from "react-router-dom";

type UsuarioInsert = Database["public"]["Tables"]["usuarios"]["Insert"];


interface AuthContextType {
  user: { name: string; picture: string } | null;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session == null) {
          setUser(null);
          navigate("/login");
        } else {
          const metadata = session.user.user_metadata;

          const user = {
            name: metadata.name,
            idauth_supabase: session.user.id,
            picture: metadata.picture
          };
          
          setUser(user);

          await insertarUsuarios(user, session.user.id);
          
          if (pathname === "/login") {
            navigate("/");
            return; 
          }
        }
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
    <AuthContext.Provider value={{ user }}>
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
