import styled from "styled-components";
import { Header, v, Btnfiltro } from "../../index";
import { useState } from "react";
import { useUsuariosStore, useCuentaStore } from "../../index";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

export function CuentasTemplate() {
  const [state, setState] = useState(false);
  const [openRegistro, setOpenRegistro] = useState(false);
  const { datausuarios } = useUsuariosStore();
  const { mostrarCuentas, datacuentas, insertarCuenta, actualizarCuenta, eliminarCuenta } = useCuentaStore();

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

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Nueva Cuenta',
      html: `
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
        <input id="saldo" type="number" class="swal2-input" placeholder="Saldo inicial">
        <input id="icono" class="swal2-input" placeholder="Icono">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value,
          saldo_actual: Number((document.getElementById('saldo') as HTMLInputElement).value),
          icono: (document.getElementById('icono') as HTMLInputElement).value,
          idusuario: datausuarios?.id ?? 0
        }
      }
    });

    if (formValues) {
      await insertarCuenta(formValues);
    }
  };

  const handleUpdate = async (cuenta) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Cuenta',
      html: `
        <input id="descripcion" class="swal2-input" placeholder="Descripción" value="${cuenta.descripcion}">
        <input id="saldo" type="number" class="swal2-input" placeholder="Saldo" value="${cuenta.saldo_actual}">
        <input id="icono" class="swal2-input" placeholder="Icono" value="${cuenta.icono}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value,
          saldo_actual: Number((document.getElementById('saldo') as HTMLInputElement).value),
          icono: (document.getElementById('icono') as HTMLInputElement).value,
        }
      }
    });

    if (formValues) {
      await actualizarCuenta(cuenta.id, formValues);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await eliminarCuenta(id);
      Swal.fire('Eliminado', 'La cuenta ha sido eliminada', 'success');
    }
  };

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
        <Btnfiltro
          funcion={handleCreate}
          bgcolor={v.colorselector}
          textcolor={v.colorPrimary}
          icono={<v.agregar />}
        />
      </section>

      <section className="main">
        {isLoading && <p>Cargando cuentas...</p>}
        {error && <p>Error al cargar las cuentas</p>}
        {datacuentas?.length > 0 ? (
          <div className="accounts-grid">
            {datacuentas.map((cuenta) => (
              <div key={cuenta.id} className="account-card">
                <div className="card-header">
                  <span className="icon">{cuenta.icono}</span>
                  <h3>{cuenta.descripcion}</h3>
                </div>
                <p className="balance">{datausuarios.moneda} {cuenta.saldo_actual.toFixed(2)}</p>
                <div className="card-actions">
                  <button onClick={() => handleUpdate(cuenta)}>✏️</button>
                  <button onClick={() => handleDelete(cuenta.id)}>🗑️</button>
                </div>
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

      .card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .balance {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0.5rem 0;
      }

      .card-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
        margin-top: 1rem;

        button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          
          &:hover {
            background: ${({ theme }) => theme.bgAlpha};
          }
        }
      }
    }
  }
`;