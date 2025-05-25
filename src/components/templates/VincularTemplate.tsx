import styled from "styled-components";
import { useEffect, useState } from "react";
import { Header, supabase, useConexionesStore, useUsuariosStore } from "../../index";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Conexion {
  canal: string;
  canal_user_id: string;
  canal_username: string;
  usuario_id: string;
}

export const VincularTemplate: React.FC = () => {
  const { usuario } = useUsuariosStore();
  const { conexiones, insertarConexion, mostrarConexiones } = useConexionesStore();
  const [status, setStatus] = useState<'loading' | 'no-session' | 'success' | 'already' | 'error'>('loading');
  const [msgError, setMsgError] = useState<string>('');
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const canal = urlParams.get('canal') || 'telegram';
  const canal_user_id = urlParams.get('id');
  const canal_username = urlParams.get('username') || '';

  const { isLoading, error } = useQuery({
    queryKey: ['mostrar conexiones', usuario?.id],
    queryFn: () => {
      if (!usuario?.id) {
        throw new Error('User ID is required');
      }
      return mostrarConexiones({ usuario_id: usuario.id });
    },
    enabled: !!usuario,
  });

  useEffect(() => {
    const vincular = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        setStatus("no-session");
        return;
      }

      if(usuario?.id === undefined) {
        setStatus("error");
        setMsgError("No se encontró el ID de usuario.");
        return;
      }

      if (!canal_user_id) {
        setStatus("error");
        setMsgError("No se encontró el ID de usuario de Telegram.");
        return;
      }

      if (!conexiones) return; // espera a que estén las conexiones

      const p = {
        usuario_id: usuario.id,
        canal,
        canal_user_id,
        canal_username,
      };

      const yaVinculado = conexiones.some((c) => c.canal_user_id === canal_user_id);
      if (yaVinculado) {
        setStatus("already");
        return;
      }
      try {
        const data = await insertarConexion(p);
        console.log("data", data);

        setStatus("success");
      } catch (err) {
        console.log("error", err);

        if (err instanceof Error && err.message.includes("duplicate")) {
          setStatus("already");
        } else {
          setStatus("error");
        }
      }
    };

    if (!isLoading && !error && usuario?.id) {
      vincular();
    }
  }, [isLoading, error, conexiones, usuario, canal_user_id]);

  return (
    <Container>
      <header className="header">
        <Header stateConfig={{ state: false, setState: () => {} }} />
      </header>
      <section className="area2">
        {status === "loading" && <p>🔄 Verificando tu sesión...</p>}
        {status === "no-session" && <p>🔒 Iniciá sesión para vincular tu cuenta.</p>}
        {status === "success" && <p>✅ ¡Tu cuenta fue vinculada exitosamente!</p>}
        {status === "already" && <p>⚠️ Esta cuenta de {canal} ya está vinculada.</p>}
        {status === "error" && <p>❌ Ocurrió un error al vincular tu cuenta.</p>}
      </section>
      <section className="area1">
        {(status === "success" || status === "already") && <IrAConexiones onClick={() => navigate("/conexiones")}>🔗 Ver mis cuentas vinculadas</IrAConexiones>}

        {msgError && <p>{msgError}</p>}
      </section>
      <section className="main">
        {conexiones && conexiones?.length > 0 && (
          <ListaCuentas>
            <h3>Cuentas vinculadas</h3>
            <ul>
              {conexiones.map((conexion) => (
                <li key={conexion.canal + conexion.canal_user_id}>
                  <span className="icono">🔗</span>
                  <strong>{conexion.canal}</strong> – @{conexion.canal_username || "sin username"} (ID: {conexion.canal_user_id})
                </li>
              ))}
            </ul>
          </ListaCuentas>
        )}
      </section>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "area1" 100px
    "area2" 70px
    "main" auto;

  .header {
    grid-area: header;
    //  background-color: rgba(103, 93, 241, 0.14);
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    //  background-color: rgba(229, 67, 26, 0.14);
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    // background-color: rgba(77, 237, 106, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
  }
  .main {
    grid-area: main;
    // background-color: rgba(179, 46, 241, 0.14);
  }
`;
const Titulo = styled.span`
  font-size: 5rem;
  font-weight: 700;
`;
const ContainerBtn = styled.div`
  display: flex;
  justify-content: center;
`;
const ListaCuentas = styled.div`
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-top: 1rem;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.text};
    padding-bottom: 0.3rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icono {
    font-size: 1.3rem;
  }

  .btn-eliminar {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    color: tomato;

    &:hover {
      color: red;
    }
  }
`;
const IrAConexiones = styled.button`
  margin-top: 10px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.primary || "#4fa3f7"};
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;
