import { useState } from "react";
import styled from "styled-components";
import {
  ContentAccionesTabla,
  useCategoriasStore,
  Paginacion,
  Categoria,
  CategoriaQueryParams
} from "../../../index";
import Swal from "sweetalert2";
import { v } from "../../../styles/variables";

interface TablaCategoriasProps {
  data: Categoria[];
  setOpenRegistro: (value: boolean) => void;
  setdataSelect: (data: Categoria) => void;
  setAccion: (accion: "Editar" | "Crear") => void;
}

interface ColorContentProps {
  $alto: string;
  $ancho: string;
  color: string;
}

export const TablaCategorias = ({
  data,
  setOpenRegistro,
  setdataSelect,
  setAccion,
}: TablaCategoriasProps) => {
  // Add better data validation
  if (!data || !Array.isArray(data)) {
    return <Container>No hay datos disponibles</Container>;
  }

  if (data.length === 0) {
    return <Container>No hay categorías registradas</Container>;
  }

  const [pagina, setPagina] = useState<number>(1);
  const [porPagina, setPorPagina] = useState<number>(10);

  const mx = data.length / porPagina;
  const maximo = mx < 1 ? 1 : mx;

  const { eliminarCategoria } = useCategoriasStore();

  const eliminar = (p: Categoria): void => {
    Swal.fire({
      title: "¿Estás seguro(a)(e)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed && p.id && p.idusuario) {
        console.log("Eliminando categoría...", p);

        await eliminarCategoria({ id: p.id, idusuario: p.idusuario } as CategoriaQueryParams);
      }
    });
  };

  const editar = (data: Categoria): void => {
    setOpenRegistro(true);
    setdataSelect(data);
    setAccion("Editar");
  };

  return (
    <>
      <Container>
        <table className="responsive-table">
          <thead>
            <tr>
              <th scope="col">Descripcion</th>
              <th scope="col">Icono</th>
              <th scope="col">Color</th>
              <th scope="col">Acciones</th>
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
                    <th scope="row">{item.descripcion}</th>
                    <td data-title="Icono">{item.icono}</td>
                    <td data-title="Color" className="Colordiv">
                      <div className="ColorContent">
                        <Colorcontent
                          color={item.color || ''}
                          $alto="25px"
                          $ancho="25px"
                        />
                      </div>
                    </td>
                    <td data-title="Acciones">
                      <ContentAccionesTabla
                        funcionEditar={() => editar(item)}
                        funcionEliminar={() => eliminar(item)}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
      </Container>
    </>
  );
}
const Container = styled.div`
  position: relative;

  margin: 5% 3%;
  @media (min-width: ${v.bpbart}) {
    margin: 2%;
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
const Colorcontent = styled.div<ColorContentProps>`
  justify-content: center;
  min-height: ${(props) => props.$alto};
  width: ${(props) => props.$ancho};
  display: block;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  text-align: center;
`;
