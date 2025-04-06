import styled from "styled-components";
import { CalendarioLineal, Header, Tabs, ContentFiltros, Btndesplegable, ListaMenuDesplegable, DataDesplegableMovimientos, useOperaciones, Btnfiltro, v, TipoMovimiento } from "../../index";
import { JSX, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
export const InformesTemplate = (): JSX.Element => {
  const {
    setTipoMovimientos,
    tipo,
    colorCategoria,
    año,
    mes,
    bgCategoria,
    tituloBtnDes,
    tituloBtnDesMovimientos,
  } = useOperaciones();
  const [stateTipo, setStateTipo] = useState<boolean>(false);
  const [state, setState] = useState<boolean>(false);
  const [value, setValue] = useState<Dayjs>(dayjs(Date.now()));
  const openTipo = (): void => {
    setStateTipo(!stateTipo);
    setState(false);
  };
  const cambiarTipo = (p: TipoMovimiento): void => {
    setTipoMovimientos(p);
    setStateTipo(!stateTipo);
    setState(false);
  };
  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      <section className="area1">
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
        <h1>Informes</h1>

      </section>
      <section className="area2">
        <CalendarioLineal value={value}
          setValue={setValue} />
      </section>
      <section className="main">
        <Tabs />
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
    gap:20px;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
   // background-color: rgba(77, 237, 106, 0.14);
    display: flex;
    align-items: center;
    justify-content:center;
    padding-bottom:20px;
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
