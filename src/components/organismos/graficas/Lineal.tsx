import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { JSX } from "react";
import { DataRptMovimientosAñoMes } from "../../../index";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface DataGrafica {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
    borderRadius?: number;
    cutout?: number;
    minBarLength?: number;
    hoverOffset?: number;
    offset?: number;
  }>;
}

interface LinealProps {
  data: DataRptMovimientosAñoMes;
  tipo: string;
}

export const Lineal = ({ data, tipo }: LinealProps): JSX.Element => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    labels: [titulo],
    datasets: (dataTipo || []).map((item, index) => ({
      label: item.descripcion,
      data: [item.total],
      backgroundColor: colors[index % colors.length][0],
      borderColor: colors[index % colors.length][1],
      borderWidth: 2,
      tension: 0.3,
      fill: true,
      borderRadius: 5,
      cutout: 30,
      hoverOffset: 16,
      offset: 10,
    })),
  };

  return (
    <Container>
      <section>
        <Line data={datagrafica} options={options} />
      </section>
      <section>
        <h2>{titulo} por categoria</h2>
        {dataTipo.map((item, index) => (
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
