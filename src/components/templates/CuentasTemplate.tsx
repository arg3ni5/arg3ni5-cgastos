import styled from "styled-components";
import { Header } from "../../index";
import { useState } from "react";
import { useUsuariosStore, useCuentaStore } from "../../index";
import { useQuery } from "@tanstack/react-query";

export function CuentasTemplate() {
  const [state, setState] = useState(false);
  const { datausuarios } = useUsuariosStore();
  const { mostrarCuentas, datacuentas } = useCuentaStore();

  const { isLoading, error } = useQuery({
    queryKey: ["mostrar cuentas", datausuarios?.id],
    queryFn: () => {
      if (!datausuarios?.id) {
        throw new Error('User ID is not available');
      }
      return mostrarCuentas({ idusuario: datausuarios.id });
    },
    enabled: !!datausuarios?.id,
  });

  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      <section className="area1">
        <h1>Mis Cuentas</h1>
      </section>
      <section className="area2">
        {/* Add new account button here */}
      </section>
      <section className="main">
        {isLoading && <p>Cargando cuentas...</p>}
        {error && <p>Error al cargar las cuentas</p>}
        {datacuentas?.length > 0 ? (
          <div className="accounts-grid">
            {datacuentas.map((cuenta) => (
              <div key={cuenta.id} className="account-card">
                <h3>{cuenta.descripcion}</h3>
                <p>{cuenta.saldo_actual}</p>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && <p>No hay cuentas registradas</p>
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
    "area2" 50px
    "main" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    display: flex;
    align-items: center;
    h1 {
      font-size: 2rem;
      margin-left: 1rem;
    }
  }
  .area2 {
    grid-area: area2;
    display: flex;
    align-items: center;
  }
  .main {
    grid-area: main;
    padding: 1rem;

    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .account-card {
      background: ${({ theme }) => theme.bg};
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
`;