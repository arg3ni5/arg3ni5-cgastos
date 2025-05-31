import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { JSX } from "react";
import { RptMovimientosMesAnio } from "../../../index";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface BarrasProps {
  datagrafica: {
    labels: string[];
    datasets: {
      tension: number;
      fill: boolean;
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  data: RptMovimientosMesAnio;
  titulo: string;
}

export const Barras = ({ datagrafica, data, titulo }: BarrasProps): JSX.Element => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%"
  };

  return (
    <Container>
      <section>
        <Bar data={datagrafica} options={options} />
      </section>
      <section>
        <h2>{titulo} por categoria</h2>
        {data.map((item, index) => (
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
