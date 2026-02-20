import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { JSX } from "react";
import { DataRptMovimientosAñoMes } from "../../../index";
ChartJS.register(ArcElement, Tooltip, Legend);

interface DataGrafica {
  labels: string[];
  datasets: {
    tension: number;
    fill: boolean;
    label: string;
    borderRadius: number;
    cutout: number;
    minBarLength: number;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
    hoverOffset: number;
    offset: number;
  }[];
}
interface DonaProps {
  data: DataRptMovimientosAñoMes;
  tipo: string;
}

export const Dona = ({ data, tipo }: DonaProps): JSX.Element => {
  const options = {
    responsive: true,
    cutout: "60%"
  };
  const dataTipo = tipo == 'i' ? data.i : data.g;
  const titulo = tipo == 'i' ? 'Ingresos' : 'Gastos';
  const colors = [
    ["rgba(255, 99, 132, 0.2)", "rgba(255, 99, 132, 1)"],
    ["rgba(54, 162, 235, 0.2)", "rgba(54, 162, 235, 1)"],
    ["rgba(255, 206, 86, 0.2)", "rgba(255, 206, 86, 1)"],
    ["rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 1)"],
    ["rgba(153, 102, 255, 0.2)", "rgba(153, 102, 255, 1)"],
    ["rgba(255, 159, 64, 0.2)", "rgba(255, 159, 64, 1)"],
  ];
  const datagrafica: DataGrafica = {
    labels: dataTipo?.map((item) => item.descripcion) || [],
    datasets: [
      {
        tension: 0.3,
        fill: true,
        label: "Total",
        borderRadius: 5,
        cutout: 30,
        minBarLength: 100,
        data: dataTipo?.map((item) => item.total),
        backgroundColor: colors.map((item) => item[0]),
        borderColor: colors.map((item) => item[1]),
        borderWidth: 2,
        hoverOffset: 16,
        offset: 10,
      },
    ],
  };

  return (
    <Container>
      <section>
        <Doughnut data={datagrafica} options={options} />
      </section>
      <section>
        <h2>{titulo} por categoria</h2>
        {dataTipo?.map((item, index) => (
          <ContentCars key={index}>
            <div className="contentDescripcion">
              <span>{item.icono}</span>
              <span className="descripcion">{item.descripcion}</span>
            </div>
            <span>{item.total}</span>
          </ContentCars>
        ))}
      </section>
    </Container>
  );
};
const Container = styled.div`
display:flex;
flex-wrap:wrap;
justify-content:center;
align-items:center;
gap:18px;

`;
const ContentCars = styled.div`
display:flex;
justify-content:space-between;
.contentDescripcion{
    display:flex;
    gap:10px;
}
`;
