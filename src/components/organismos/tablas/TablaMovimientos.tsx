import styled from "styled-components";
import {
  Accion,
  ContentAccionesTabla,
  hexToRgba,
  Movimiento,
  MovimientosMesAnio,
  Paginacion,
  Tipo,
  useMovimientosStore,
} from "../../../index";
import Swal from "sweetalert2";
import { v } from "../../../styles/variables";
import { JSX, useState } from "react";
import { convertToMovimiento } from '../../../supabase/crudMovimientos';

interface TablaMovimientosProps {
  titulo?: string;
  tipo: Tipo;
  color: string;
  data: MovimientosMesAnio | null;
  setOpenRegistro: (value: boolean) => void;
  setDataSelect: (data: Movimiento) => void;
  setAccion: (value: Accion) => void;
}

export const TablaMovimientos = ({
  titulo,
  tipo,
  color,
  data,
  setOpenRegistro,
  setDataSelect,
  setAccion,
}: TablaMovimientosProps): JSX.Element | null => {
  if (data == null) {
    return null;
  }

  const [pagina, setPagina] = useState<number>(1);
  const [porPagina, setPorPagina] = useState<number>(10);
  const mx = data.length / porPagina;
  const maximo = mx < 1 ? 1 : mx;

  const { eliminarMovimiento } = useMovimientosStore();

  const eliminar = (p: Movimiento): void => {
    Swal.fire({
      title: "¿Estás seguro(a)(e)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarMovimiento({ id: p.id } as Movimiento);
      }
    });
  };

  const editar = (data: Movimiento): void => {
    setOpenRegistro(true);
    setDataSelect({ ...data, tipo: tipo.tipo });
    setAccion("Editar");
  };

  const esPagado = (estado: unknown): boolean => {
    if (typeof estado === "boolean") return estado;
    if (typeof estado === "number") return estado === 1;
    if (typeof estado === "string") {
      const valor = estado.trim().toLowerCase();
      return valor === "1" || valor === "true";
    }
    return false;
  };

  return (
    <>
      <Container $bgcolor={tipo.bgcolor || ''} $color={tipo.color || ''}>
        {titulo && (<h2>{titulo}</h2>)}
        <table className="responsive-table">
          <thead>
            <tr>
              <th scope="col">Pagado</th>
              <th scope="col">Fecha</th>
              <th scope="col">Descripcion</th>
              <th scope="col">Categoria</th>
              <th scope="col">Cuenta</th>
              <th scope="col">Valor</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data
              .slice(
                (pagina - 1) * porPagina,
                (pagina - 1) * porPagina + porPagina
              )
              .map((item) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">
                      <Pagado
                        $bgcolor={esPagado(item.estado) ? "#69e673" : "#b3b3b3"}
                      ></Pagado>
                    </th>
                    <td data-title="Fecha" >{item.fecha}</td>
                    <td data-title="Descripcion" >
                      {item.descripcion}
                    </td>
                    <td data-title="Categoria" >{item.categoria}</td>
                    <td data-title="Cuenta">{item.cuenta}</td>
                    <td data-title="Monto">{item.valorymoneda}</td>
                    <td data-title="Acciones" >
                      <ContentAccionesTabla
                        funcionEditar={() => editar(convertToMovimiento(item))}
                        funcionEliminar={() => eliminar(convertToMovimiento(item))}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="pagination">

          {maximo > 1 && <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} color={color} />}
        </div>
      </Container>
    </>
  );
}
interface ContainerProps {
  $bgcolor: string;
  $color: string;
}
const Container = styled.div<ContainerProps>`
  border-radius: 25px;
  width: 100%;
  background-color: ${(props) => hexToRgba(props.$color, 0.14)};

  position: relative;

  margin: 5% 3%;

  h2 {
    padding: 20px;
  }
  .pagination{
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (min-width: ${v.bpbart}) {
    margin: 0;
  }
  @media (min-width: ${v.bphomer}) {
    margin: 2em auto;
    max-width: ${v.bphomer};
  }
  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    @media (min-width: ${v.bpbart}) {
      font-size: 0.9em;
    }
    @media (min-width: ${v.bpmarge}) {
      font-size: 1em;
    }
    thead {
      position: absolute;

      padding: 0;
      border: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;
      @media (min-width: ${v.bpbart}) {
        position: relative;
        height: auto;
        width: auto;
        overflow: auto;
      }
      th {
        border-bottom: 2px solid rgba(115, 115, 115, 0.32);
        font-weight: normal;
        text-align: center;
        color: ${({ theme }) => theme.text};
        &:first-of-type {
          text-align: center;
        }
      }
    }
    tbody,
    tr,
    th,
    td {
      display: block;
      padding: 0;
      text-align: left;
      white-space: normal;
    }
    tr {
      @media (min-width: ${v.bpbart}) {
        display: table-row;
      }
    }

    th,
    td {
      padding: 0.5em;
      vertical-align: middle;
      @media (min-width: ${v.bplisa}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bpbart}) {
        display: table-cell;
        padding: 0.5em;
      }
      @media (min-width: ${v.bpmarge}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bphomer}) {
        padding: 0.75em;
      }
    }
    tbody {
      @media (min-width: ${v.bpbart}) {
        display: table-row-group;
      }
      tr {
        margin-bottom: 1em;
        @media (min-width: ${v.bpbart}) {
          display: table-row;
          border-width: 1px;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
        &:nth-of-type(even) {
          @media (min-width: ${v.bpbart}) {
            background-color: rgba(151, 151, 151, 0.12);
          }
        }
      }
      th[scope="row"] {
        @media (min-width: ${v.bplisa}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        }
        @media (min-width: ${v.bpbart}) {
          background-color: transparent;
          text-align: center;
          color: ${({ theme }) => theme.text};
        }
      }
      .Colordiv {
        text-align: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80px;
        @media (min-width: ${v.bpbart}) {
          justify-content: center;
        }
      }
      td {
        text-align: right;
        @media (min-width: ${v.bpbart}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
          text-align: center;
        }

      }
      td[data-type="currency"] {
        font-weight:600;
      }
      td[data-title]:before {
        content: attr(data-title);
        float: left;
        font-size: 0.8em;
        @media (min-width: ${v.bplisa}) {
          font-size: 0.9em;
        }
        @media (min-width: ${v.bpbart}) {
          content: none;
        }
      }
    }
  }
`;
interface ColorcontentProps {
  $alto?: string;
  $ancho?: string;
  color?: string;
}

interface PagadoProps {
  $bgcolor: string;
}

const Colorcontent = styled.div<ColorcontentProps>`
  justify-content: center;
  min-height: ${(props) => props.$alto};
  width: ${(props) => props.$ancho};
  display: block;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  text-align: center;
`;

const Pagado = styled.div<PagadoProps>`
  display: flex;
  justify-content: center;
  &::before {
    content: "";
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.$bgcolor};
  }
`;
