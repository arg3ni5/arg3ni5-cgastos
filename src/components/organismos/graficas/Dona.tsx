import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { JSX } from "react";
import { DataRptMovimientosAñoMes, useUsuariosStore } from "../../../index";
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
  const { usuario } = useUsuariosStore();
  const formatCurrency = (valor: number): string =>
    `${usuario?.moneda || "$"} ${new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 0,
    }).format(valor)}`;

  const options = {
    responsive: true,
    cutout: "60%",
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed: number }): string => {
            const label = context.label || "Total";
            return `${label}: ${formatCurrency(Number(context.parsed || 0))}`;
          }
        }
      }
    }
  };
  const dataTipo = tipo == 'i' ? data.i : data.g;
  const titulo = tipo == 'i' ? 'Ingresos' : 'Gastos';
  const totalGeneral = (dataTipo || []).reduce((acum, item) => acum + Number(item.total || 0), 0);
  const colors = [
    ["rgba(255, 99, 132, 0.2)", "rgba(255, 99, 132, 1)"],
    ["rgba(54, 162, 235, 0.2)", "rgba(54, 162, 235, 1)"],
    ["rgba(255, 206, 86, 0.2)", "rgba(255, 206, 86, 1)"],
    ["rgba(75, 192, 192, 0.2)", "rgba(75, 192, 192, 1)"],
    ["rgba(153, 102, 255, 0.2)", "rgba(153, 102, 255, 1)"],
    ["rgba(255, 159, 64, 0.2)", "rgba(255, 159, 64, 1)"],
  ];
  const withAlpha = (hexColor: string, alphaHex: string): string => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hexColor)) return `${hexColor}${alphaHex}`;
    return hexColor;
  };
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
        backgroundColor: (dataTipo || []).map((item, i) => item.color ? withAlpha(item.color, '33') : colors[i % colors.length][0]),
        borderColor: (dataTipo || []).map((item, i) => item.color || colors[i % colors.length][1]),
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
        <ContentTotal>
          <span>Total</span>
          <strong>{formatCurrency(totalGeneral)}</strong>
        </ContentTotal>
        {dataTipo?.map((item, index) => (
          <ContentCars key={index} $borderColor={item.color || (tipo === 'i' ? '#54A2EB' : '#FF6384')}>
            <div className="contentDescripcion">
              <span>{item.icono}</span>
              <span className="descripcion">{item.descripcion}</span>
            </div>
            <span>{formatCurrency(Number(item.total || 0))}</span>
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
const ContentCars = styled.div<{ $borderColor: string }>`
display:flex;
justify-content:space-between;
border-bottom: 2px solid ${({ $borderColor }) => $borderColor};
padding: 6px 0;
.contentDescripcion{
    display:flex;
    gap:10px;
}
`;

const ContentTotal = styled.div`
display:flex;
justify-content:space-between;
margin: 8px 0 12px;
`;
