import styled from "styled-components";
import {
  Header,
  ContentFiltros,
  Btndesplegable,
  useOperaciones,
  ListaMenuDesplegable,
  Btnfiltro,
  v,
  Lottieanimacion,
  Tipo,
  Accion,
  Movimiento,
  TablaMovimientos,
  useMovimientosStore,
  RegistrarMovimientos,
  CardTotales,
  Device,
  CalendarioLineal,
  obtenerTitulo,
  BtnIcono,
  FiltrosMovimientosResponsive, // Added import
} from "../../index";
import { JSX, useState } from "react";
import vacioverde from "../../assets/vacioverde.json";
import vaciorojo from "../../assets/vaciorojo.json";
import vacioazul from "../../assets/vacioazul.json";
import { DataDesplegables } from '../../utils/dataEstatica';


export const MovimientosTemplate = (): JSX.Element => {
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState<Accion>("Nuevo");
  const [state, setState] = useState(false); // state for openUser kept
  // const [stateTipo, setStateTipo] = useState(false); // Removed stateTipo
  const { setTipoMovimientos, selectTipoMovimiento: tipo } = useOperaciones();
  const {
    totalMesAño,
    totalMesAñoPagados,
    totalMesAñoPendientes,
    datamovimientos,
  } = useMovimientosStore();

  const [dataSelect, setDataSelect] = useState<Movimiento | undefined>(undefined);

  const cambiarTipo = (p: Tipo): void => {
    setTipoMovimientos(p);
    // setStateTipo(!stateTipo); // Removed line related to stateTipo
    setState(false); // Keep this if state is for other dropdowns like user menu
  };

  const cerrarDesplegables = (): void => {
    // setStateTipo(false); // Removed line related to stateTipo
    setState(false); // Keep this if state is for other dropdowns
  };

  // const openTipo = (): void => { // Removed openTipo function
  //   setStateTipo(!stateTipo);
  //   setState(false);
  // };
  const openUser = (): void => {
    setState(!state);
    // setStateTipo(false); // Removed line related to stateTipo
  };

  const gastos = DataDesplegables.movimientos['g'];
  const ingresos = DataDesplegables.movimientos['i'];
  const balance = DataDesplegables.movimientos['b'];

  const nuevoRegistro = (): void => {
    setOpenRegistro(!openRegistro);
    setAccion("Nuevo");
    setDataSelect(undefined);
  };
  return (
    <Container onClick={cerrarDesplegables}>
      {openRegistro && (
        <RegistrarMovimientos
          accion={accion}
          dataSelect={dataSelect}
          state={openRegistro}
          setState={() => setOpenRegistro(!openRegistro)}
        />
      )}

      <header className="header">
        <Header stateConfig={{ state: state, setState: openUser }} />
      </header>

      <section className="tipo">
        <FiltrosContainer>
          {/* Old filter logic removed, new component added below */}
          <FiltrosMovimientosResponsive
            currentTipo_tipo={tipo.tipo}
            onFiltroChange={cambiarTipo}
            dataDesplegables_movimientos={DataDesplegables.movimientos}
            v_obj={v}
            Device_obj={Device}
            BtnIcono_comp={BtnIcono}
            Btndesplegable_comp={Btndesplegable}
            ListaMenuDesplegable_comp={ListaMenuDesplegable}
          />
        </FiltrosContainer>
        <ContentFiltro>
          <Btnfiltro
            funcion={nuevoRegistro}
            bgcolor={tipo.bgcolor}
            textcolor={tipo.color}
            icono={<v.agregar />}
          />
        </ContentFiltro>
      </section>

      <section className="totales">
        <CardTotales
          total={totalMesAñoPendientes}
          title={obtenerTitulo(tipo.tipo as "i" | "g" | "b", "pendientes")}
          color={tipo.color}
          icono={<v.flechaarribalarga />}
        />
        <CardTotales
          total={totalMesAñoPagados}
          title={obtenerTitulo(tipo.tipo as "i" | "g" | "b", "pagados")}
          color={tipo.color}
          icono={<v.flechaabajolarga />}
        />
        <CardTotales
          total={totalMesAño}
          title="Total"
          color={tipo.color}
          icono={<v.balance />}
        />
      </section>

      <section className="calendario">
        <CalendarioLineal />
      </section>

      <section className="main">

        {(tipo.tipo == "i" || tipo.tipo == "b")
          && datamovimientos.i?.length > 0 &&
          <TablaMovimientos
            titulo={"Ingresos"}
            tipo={ingresos}
            color={v.colorIngresos}
            data={datamovimientos.i}
            setOpenRegistro={setOpenRegistro}
            setDataSelect={setDataSelect}
            setAccion={setAccion} />
        }

        {(tipo.tipo == "g" || tipo.tipo == "b")
          && datamovimientos.g?.length > 0 &&
          <TablaMovimientos
            titulo={"Gastos"}
            tipo={gastos}
            color={v.colorGastos}
            data={datamovimientos.g}
            setOpenRegistro={setOpenRegistro}
            setDataSelect={setDataSelect}
            setAccion={setAccion} />
        }
      </section>


      {(
        (tipo.tipo == "b" && datamovimientos.i?.length == 0 && datamovimientos.g?.length == 0) ||
        (tipo.tipo == "i" && datamovimientos.i?.length == 0) ||
        (tipo.tipo == "g" && datamovimientos.g?.length == 0)
      ) && (
          <section className="empty">
            <Lottieanimacion
              alto={300}
              ancho={300}
              animacion={tipo.tipo == "i" ? vacioverde : (tipo.tipo == "g" ? vaciorojo : vacioazul)}
            />
          </section>
        )}
    </Container>
  );
}
const Container = styled.div`
  max-width: 100%;
  overflow-x: hidden;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "tipo" 100px
    "totales" auto
    "calendario" 100px
    "main" auto    
    "empty" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }
  .tipo {
    grid-area: tipo;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .totales {
    grid-area: totales;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .empty {
  }
  .main {
    grid-area: main;
    flex-wrap: wrap;
    
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
`;
const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FiltrosContainer = styled.div`
  display: flex;
  align-items: center; // Align items vertically
  gap: ${v.spacingS}; // Use theme variable for gap
`;
