import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { JSX } from "react";
import { RptMovimientosMesAnio } from "../../../index";
ChartJS.register(ArcElement, Tooltip, Legend);
interface DonaProps {
  datagrafica: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      hoverOffset: number;
      offset: number;
    }[];
  };
  data: RptMovimientosMesAnio;
  titulo: string;
}

export const Dona = ({ datagrafica, data, titulo }: DonaProps): JSX.Element => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%"
  };

  return (
    <Container>
      <section>
        <Doughnut data={datagrafica} options={options} />
      </section>
      <section>
        <h2>{titulo} por categoria</h2>
        {data?.map((item, index) => (
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
