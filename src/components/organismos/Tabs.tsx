import { JSX, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  v,
  Dona,
  Lineal,
  useMovimientosStore,
  useOperaciones,
  useUsuariosStore,
  Barras,
  DataRptMovimientosAñoMes,
} from "../../index";
import { useQuery } from "@tanstack/react-query";
interface ContainerProps {
  theme: {
    bg: string;
    carouselColor: string;
  };
}

interface DataGrafica {
  labels: string[];
  datasets: {
    tension: number;
    fill: boolean;
    label: string;
    borderRadius: number;
    cutout: number;
    minBarLength: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
    hoverOffset: number;
    offset: number;
  }[];
}

export const Tabs = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [gliderStyle, setGliderStyle] = useState<{ left: string; width: string }>({
    left: "0px",
    width: "75px"
  });

  const tabRefs = useRef<Array<HTMLLIElement | null>>([]);

  const handleClick = (index: number): void => {
    setActiveTab(index);
  };


  useLayoutEffect(() => {
    const updateGlider = () => {
      const current = tabRefs.current[activeTab];
      if (current) {
        const { offsetLeft, clientWidth } = current;
        setGliderStyle({
          left: `${offsetLeft}px`,
          width: `${clientWidth}px`,
        });
      }
    };

    const raf = requestAnimationFrame(updateGlider);
    window.addEventListener("resize", updateGlider);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateGlider);
    };
  }, [activeTab]);


  const { idusuario } = useUsuariosStore();
  const { date, selectTipoMovimiento: tipo } = useOperaciones();
  const { dataRptMovimientosAñoMes, rptMovimientosAñoMes, rptParams } = useMovimientosStore();

  const datagraficaG: DataGrafica = {
    labels: dataRptMovimientosAñoMes?.g?.map((item) => item.descripcion) || [],
    datasets: [
      {
        tension: 0.3,
        fill: true,
        label: "Total",
        borderRadius: 5,
        cutout: 30,
        minBarLength: "100px",
        data: dataRptMovimientosAñoMes?.g?.map((item) => item.total),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 16,
        offset: 10,
      },
    ],
  };

  const datagraficaI: DataGrafica = {
    labels: dataRptMovimientosAñoMes.i?.map((item) => item.descripcion) || [],
    datasets: [
      {
        tension: 0.3,
        fill: true,
        label: "Total",
        borderRadius: 5,
        cutout: 30,
        minBarLength: "100px",
        data: dataRptMovimientosAñoMes.i?.map((item) => item.total) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 16,
        offset: 10,
      },
    ],
  };

  const { isLoading, error } = useQuery<DataRptMovimientosAñoMes | null, Error>({
    queryKey: ['rptMovimientos', tipo, idusuario, date.format('YYYY-MM')],
    queryFn: () => rptMovimientosAñoMes({
      anio: date.year(),
      mes: date.month() + 1,
      tipocategoria: tipo.tipo,
      iduser: idusuario,
    }),
    enabled: date.month() + 1 !== rptParams.mes || date.year() !== rptParams.anio
  });

  if (isLoading) return <h1>Cargando</h1>;
  if (error) return <h1>Error</h1>;

  const tabIcons = [<v.iconopie />, <v.iconobars />];

  return (
    <Container className="container">
      <div className="tabs-wrapper">
        <ul className="tabs">
          {tabIcons.map((icono, index) => (
            <li
              key={index}
              ref={(el: HTMLLIElement | null): void => { tabRefs.current[index] = el }}
              className={activeTab === index ? "active" : ""}
              onClick={() => handleClick(index)}
            >
              {icono}
            </li>
          ))}
          <span className="glider" style={gliderStyle}></span>
        </ul>

      </div>



      <div className="tab-content">
        {activeTab === 0 && (
          <ChartGrid>
            {((rptParams.tipocategoria === "g" || rptParams.tipocategoria === "b") && (
              <>
                <ChartContainer>
                  <Dona data={dataRptMovimientosAñoMes} tipo={"g"} />
                </ChartContainer>

                <ChartContainer>
                  <Dona data={dataRptMovimientosAñoMes} tipo={"i"} />
                </ChartContainer>
              </>
            ))}
          </ChartGrid>
        )}
        {activeTab === 1 && (
          <ChartGrid>
            {((rptParams.tipocategoria === "g" || rptParams.tipocategoria === "b") && (
              <>
                <ChartContainer>
                  <Barras datagrafica={datagraficaG} data={dataRptMovimientosAñoMes} tipo={"g"} horizontal/>
                </ChartContainer>

                <ChartContainer>
                  <Barras datagrafica={datagraficaG} data={dataRptMovimientosAñoMes} tipo={"i"} horizontal/>
                </ChartContainer>
              </>
            ))}
          </ChartGrid>
        )}
        
        {activeTab === 2 && (
          <ChartGrid>
            {((rptParams.tipocategoria === "g" || rptParams.tipocategoria === "b") && (
              <>
                <ChartContainer>
                  <Lineal data={dataRptMovimientosAñoMes} tipo={'g'} />
                </ChartContainer>
                <ChartContainer>
                  <Lineal data={dataRptMovimientosAñoMes} tipo={'i'} />
                </ChartContainer>
              </>
            ))}
          </ChartGrid>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .tabs-wrapper {
    width: 100%;
    overflow: visible;
    padding: 5px 0;
    margin-bottom: 1rem;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .tabs li {
    z-index: 2;
  }
  .tabs .glider {
    z-index: 1;
  }
  .tabs {
    width: fit-content;
    list-style: none;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 10px;
    padding: 5px 0;
    margin: 0 auto;
    position: relative;
    border-radius: 100px;
    background-color: ${(props) => props.theme.bg};
    box-shadow: 0px 10px 20px -3px rgba(0, 0, 0, 0.1);

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 54px;
      width: 75px;
      font-size: 1.25rem;
      font-weight: 500;
      border-radius: 99px;
      cursor: pointer;
      transition: color 0.15s ease-in;
      flex-shrink: 0;
    }

    .glider {
      position: absolute;
      top: 0;
      height: 64px;
      background-color: ${(props) => props.theme.carouselColor};
      border-radius: 99px;
      z-index: 1;
      transition: all 0.25s ease-out;
      box-shadow: 0px 10px 20px -3px ${(props) => props.theme.carouselColor};
      left: 0; 
      width: 75px;
    }

  }

  .tab-content {
    width: 100%;
    max-width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    gap: 20px;

    @media (min-width: 768px) {
      flex-direction: row !important; /* En pantallas más grandes: lado a lado */
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }

`;
const ChartGrid = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  justify-content: center;
  align-items: center;

  @media (min-width: 850px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;  
  padding-bottom: 40px;
`;
