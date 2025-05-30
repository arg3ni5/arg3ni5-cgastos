import styled from "styled-components";
import {
  Header,
  CalendarioLineal,
  CardTotales,
  useOperaciones,
  useMovimientosStore,
  v,
  Tabs,
  DataDesplegableMovimientos,
  Tipo,
} from "../../index";
import { useEffect, useState } from "react";
import { Device } from "../../styles/breakpoints";

export const DashboardTemplate = () => {
  const [state, setState] = useState(false); // agregado para stateConfig del Header

  const {
    colorCategoria,
    setTipoMovimientos,
  } = useOperaciones();

  const {
    totalMesAño,
    totalMesAñoPagados,
    totalMesAñoPendientes,
  } = useMovimientosStore();

  useEffect(() => {
    setTipoMovimientos(DataDesplegableMovimientos[2] as Tipo);
  }, [setTipoMovimientos]);

  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>

      <section className="filtros">
        <CalendarioLineal />
      </section>

      <section className="totales">
        <CardTotales
          total={totalMesAñoPendientes}
          title="Ingresos / Gastos pendientes"
          color={colorCategoria}
          icono={<v.flechaarribalarga />}
        />
        <CardTotales
          total={totalMesAñoPagados}
          title="Ingresos / Gastos pagados"
          color={colorCategoria}
          icono={<v.flechaabajolarga />}
        />
        <CardTotales
          total={totalMesAño}
          title="Balance mensual"
          color={colorCategoria}
          icono={<v.balance />}
        />
      </section>

      <section className="graficos">
        <Tabs />
      </section>
    </Container>
  );
};

const Container = styled.div`
  max-width: 100%;
  overflow-x: hidden;
  width: 100%;
  padding: 15px;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};

  display: grid;
  grid-template:
    "header" 100px
    "filtros" 100px
    "totales" 360px
    "graficos" auto;

  @media ${Device.tablet} {
    grid-template:
      "header" 100px
      "filtros" 100px
      "totales" 140px
      "graficos" auto;
  }

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }

  .filtros {
    grid-area: filtros;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px;
  }

  .totales {
    grid-area: totales;
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;

    @media ${Device.tablet} {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .graficos {
    grid-area: graficos;
    margin-top: 20px;
  }
`;
