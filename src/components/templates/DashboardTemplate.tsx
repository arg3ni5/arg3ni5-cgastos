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
} from "../../index";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Device } from "../../styles/breakpoints";

export const DashboardTemplate = () => {
  const [value, setValue] = useState(dayjs(Date.now()));
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
    setTipoMovimientos(DataDesplegableMovimientos[2]);
  }, [setTipoMovimientos]);

  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>

      <section className="filtros">
        <CalendarioLineal value={value} setValue={setValue} />
      </section>

      <section className="totales">
        <CardTotales
          total={totalMesAñoPagados}
          title="Ingresos pagados / Gastos pagados"
          color={colorCategoria}
          icono={<v.flechaabajolarga />}
        />
        <CardTotales
          total={totalMesAñoPendientes}
          title="Pendientes"
          color={colorCategoria}
          icono={<v.flechaarribalarga />}
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
  min-height: 100vh;
  width: 100%;
  padding: 15px;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};

  display: grid;
  grid-template:
    "header" 100px
    "filtros" 100px
    "totales" 300px
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
