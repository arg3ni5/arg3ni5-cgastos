import styled from "styled-components";
import {
  Header,
  CalendarioLineal,
  CardTotales,
  useOperaciones,
  v,
  useMovimientosStore,
  useUsuariosStore,
  TablaMovimientos,
  useCuentaStore,
  useCategoriasStore,
  DataDesplegableMovimientos,
  ContentFiltros,
  Btndesplegable,
  ListaMenuDesplegable,
  Btnfiltro,
  RegistrarMovimientos,
  Movimiento,
  TipoMovimiento,
} from "../../index";
import { Device } from "../../styles/breakpoints";
import dayjs from "dayjs";
import { JSX, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const MovimientosTemplate = (): JSX.Element => {
  const [dataSelect, setDataSelect] = useState<Movimiento>();
  const [, setAccion] = useState("");
  const [openRegistro, setOpenRegistro] = useState(false);
  const [value, setValue] = useState(dayjs(Date.now()));
  const [state, setState] = useState(false);
  const [stateTipo, setStateTipo] = useState(false);
  const {
    setTipoMovimientos,
    tipo,
    colorCategoria,
    año,
    mes,
    bgCategoria,
    tituloBtnDesMovimientos,
  } = useOperaciones();
  useEffect(() => {

  }, [])
  const { idusuario } = useUsuariosStore();
  const {
    totalMesAño,
    totalMesAñoPagados,
    totalMesAñoPendientes,
    mostrarMovimientos,
    datamovimientos,
  } = useMovimientosStore();
  const { mostrarCuentas } = useCuentaStore();
  const { mostrarCategorias } = useCategoriasStore();
  const openTipo = (): void => {
    setStateTipo(!stateTipo);
    setState(false);
  };

  const cambiarTipo = (p: TipoMovimiento): void => {
    setTipoMovimientos(p);
    setStateTipo(!stateTipo);
    setState(false);
  };

  const nuevoRegistro = (): void => {
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setDataSelect(undefined);
  };

  useQuery({
    queryKey:
      [
        "mostrar movimientos mes año",
        { año: año, mes: mes, idusuario: idusuario, tipocategoria: tipo },
      ], queryFn:
      () =>
        mostrarMovimientos({
          anio: año,
          mes: mes,
          iduser: idusuario,
          tipocategoria: tipo,
        }), refetchOnWindowFocus: false,
  });
  useQuery({ queryKey: ["mostrar cuentas"], queryFn: () => mostrarCuentas({ idusuario: idusuario }) });
  useQuery({
    queryKey: ["mostrar categorias", { idusuario: idusuario, tipo: tipo }], queryFn: () =>
      mostrarCategorias({ idusuario: idusuario, tipo: tipo })
  }
  );

  return (
    <Container>
      {openRegistro && (
        <RegistrarMovimientos
          dataSelect={dataSelect!}
          state={openRegistro}
          setState={() => setOpenRegistro(!openRegistro)}
        />
      )}

      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      <section className="tipo">
        <ContentFiltros>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Btndesplegable
              textcolor={colorCategoria}
              bgcolor={bgCategoria}
              text={tituloBtnDesMovimientos}
              funcion={openTipo}
            />
            {stateTipo && (
              <ListaMenuDesplegable
                data={DataDesplegableMovimientos}
                top="112%"
                funcion={(p) => cambiarTipo(p as TipoMovimiento)}
              />
            )}
          </div>
        </ContentFiltros>
        <ContentFiltro>
          <Btnfiltro
            funcion={nuevoRegistro}
            bgcolor={bgCategoria}
            textcolor={colorCategoria}
            icono={<v.agregar />}
          />
        </ContentFiltro>
      </section>
      <section className="totales">
        <CardTotales
          total={totalMesAñoPendientes}
          title={tipo == "g" ? "Gastos pendientes" : "Ingresos pendientes"}
          color={colorCategoria}
          icono={<v.flechaarribalarga />}
        />
        <CardTotales
          total={totalMesAñoPagados}
          title={tipo == "g" ? "Gastos pagados" : "Ingresos pagados"}
          color={colorCategoria}
          icono={<v.flechaabajolarga />}
        />
        <CardTotales
          total={totalMesAño}
          title="Total"
          color={colorCategoria}
          icono={<v.balance />}
        />
      </section>
      <section className="calendario">
        <CalendarioLineal
          value={value}
          setValue={setValue}
        />
      </section>
      <section className="main">
        <TablaMovimientos
          data={datamovimientos}
          setOpenRegistro={setOpenRegistro}
          setDataSelect={setDataSelect}
          setAccion={setAccion} />
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
    "tipo" 100px
    "totales" 360px
    "calendario" 100px
    "main" auto;
    @media ${Device.tablet} {
      grid-template:
    "header" 100px
    "tipo" 100px
    "totales" 100px
    "calendario" 100px
    "main" auto;
    }

  .header {
    grid-area: header;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    align-items: center;
  }
  .tipo {
    grid-area: tipo;
    /* background-color: rgba(107, 214, 14, 0.14); */
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .totales {
    grid-area: totales;
  //  background-color: rgba(229, 26, 165, 0.14);
    display: grid;
    align-items: center;
    grid-template-columns: 1fr;
    gap: 10px;

    @media ${Device.tablet} {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .calendario {
    grid-area: calendario;
   // background-color: rgba(77, 237, 106, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main {
    grid-area: main;
   // background-color: rgba(179, 46, 241, 0.14);
  }
`;
const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
