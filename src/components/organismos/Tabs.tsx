import { JSX, useState } from "react";
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
  $activetab: string;
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

  const handleClick = (index: number): void => {
    setActiveTab(index);
  };

  const { idusuario } = useUsuariosStore();
  const { date, tipo, tituloBtnDesMovimientos } = useOperaciones();
  const { dataRptMovimientosAñoMes, rptMovimientosAñoMes, rptParams } = useMovimientosStore();

  const datagraficaG: DataGrafica = {
    labels: dataRptMovimientosAñoMes?.g.map((item) => item.descripcion),
    datasets: [
      {
        tension: 0.3,
        fill: true,
        label: "Total",
        borderRadius: 5,
        cutout: 30,
        minBarLength: "100px",
        data: dataRptMovimientosAñoMes?.g.map((item) => item.total),
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
    labels: dataRptMovimientosAñoMes?.i.map((item) => item.descripcion),
    datasets: [
      {
        tension: 0.3,
        fill: true,
        label: "Total",
        borderRadius: 5,
        cutout: 30,
        minBarLength: "100px",
        data: dataRptMovimientosAñoMes?.i.map((item) => item.total),
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
      tipocategoria: tipo,
      iduser: idusuario,
    }),
    enabled : date.month() + 1 !== rptParams.mes || date.year() !== rptParams.anio
  });

  if (isLoading) return <h1>Cargando</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Container className="container" $activetab={`${activeTab}00%`}>
      <ul className="tabs">
        <li
          className={activeTab == 0 ? "active" : ""}
          onClick={() => handleClick(0)}
        >
          {<v.iconopie />}
        </li>
        <li
          className={activeTab === 1 ? "active" : ""}
          onClick={() => handleClick(1)}
        >
          {<v.iconolineal />}
        </li>
        <li
          className={activeTab === 2 ? "active" : ""}
          onClick={() => handleClick(2)}
        >
          {<v.iconobars />}
        </li>
        <span className="glider"></span>
      </ul>

      <div className="tab-content">
        {activeTab === 0 && (
          <>
            {((rptParams.tipocategoria === "g" || rptParams.tipocategoria === "b") && <Dona datagrafica={datagraficaG} data={dataRptMovimientosAñoMes.g} titulo={'Gastos'} />)}
            {((rptParams.tipocategoria === "i" || rptParams.tipocategoria === "b") && <Dona datagrafica={datagraficaI} data={dataRptMovimientosAñoMes.i} titulo={"Ingresos"} />)}
          </>
        )}
        {activeTab === 1 && (
          <>
            {((rptParams.tipocategoria === "g" || rptParams.tipocategoria === "b") && <Lineal datagrafica={datagraficaG} data={dataRptMovimientosAñoMes.g} titulo={'Gastos'} />)}
            {((rptParams.tipocategoria === "i" || rptParams.tipocategoria === "b") && <Lineal datagrafica={datagraficaI} data={dataRptMovimientosAñoMes.i} titulo={"Ingresos"} />)}
          </>
        )}
        {activeTab === 2 && (
          <>
            {((rptParams.tipocategoria === "g" || rptParams.tipocategoria === "b") && <Barras datagrafica={datagraficaG} data={dataRptMovimientosAñoMes.g} titulo={'Gastos'} />)}
            {((rptParams.tipocategoria === "i" || rptParams.tipocategoria === "b") && <Barras datagrafica={datagraficaI} data={dataRptMovimientosAñoMes.i} titulo={"Ingresos"} />)}
          </>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div<ContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  height: 100%;
  .tabs {
    list-style: none;
    display: flex;
    box-shadow: 0px 10px 20px -3px rgba(0, 0, 0, 0.1);
    background-color: ${(props) => props.theme.bg};
    position: relative;
    border-radius: 100px;
    justify-content: space-between;
    top: 0;
    left: 0;
    * {
      z-index: 2;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 54px;
      width: 150px;
      font-size: 1.25rem;
      font-weight: 500;
      border-radius: 99px;
      cursor: pointer;
      transition: color 0.15s ease-in;
    }
    .glider {
      position: absolute;
      color: "#fff";
      display: flex;
      height: 54px;
      width: 150px;
      background-color: ${(props) => props.theme.carouselColor};
      z-index: 1;
      border-radius: 99px;
      transition: 0.25s ease-out;
      transform: translateX(${(props) => props.$activetab});  // Changed here
      box-shadow: 0px 10px 20px -3px ${(props) => props.theme.carouselColor};
    }
  }

  .tab-content {
    position: relative;
    /* border: 1px solid red; */
    border-radius: 6px;
    margin-top: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
`;
