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
import { DataRptMovimientosAñoMes, useUsuariosStore } from "../../../index";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DataGrafica {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
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

interface BarrasProps {
  data: DataRptMovimientosAñoMes;
  tipo: string;
  horizontal?: boolean;
}

export const Barras = ({ data, tipo, horizontal = false }: BarrasProps): JSX.Element => {
  const { usuario } = useUsuariosStore();
  const formatCurrency = (valor: number): string =>
    `${usuario?.moneda || "$"} ${new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 0,
    }).format(valor)}`;

  const options = {
    indexAxis: horizontal ? 'y' as const : 'x' as const,
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { x?: number; y?: number } }): string => {
            const label = context.dataset.label || "";
            const valor = horizontal ? Number(context.parsed.x || 0) : Number(context.parsed.y || 0);
            return `${label}: ${formatCurrency(valor)}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          callback: (value: string | number): string => formatCurrency(Number(value))
        }
      },
      y: {
        ticks: {
          callback: (value: string | number): string => horizontal ? String(value) : formatCurrency(Number(value))
        }
      }
    }
  };

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
  const dataTipo = tipo == 'i' ? data.i : data.g;
  const titulo = tipo == 'i' ? 'Ingresos' : 'Gastos';
  const totalGeneral = (dataTipo || []).reduce((acum, item) => acum + Number(item.total || 0), 0);
  const isHorizontal = !!horizontal;

  const datagrafica: DataGrafica = isHorizontal
    ? {
      labels: (dataTipo || []).map((item) => item.descripcion),
      datasets: [
        {
          label: "Total",
          data: (dataTipo || []).map((item) => item.total),
          backgroundColor: (dataTipo || []).map((item, i) => item.color ? withAlpha(item.color, '33') : colors[i % colors.length][0]),
          borderColor: (dataTipo || []).map((item, i) => item.color || colors[i % colors.length][1]),
          borderWidth: 2,
        }
      ]
    }
    : {
      labels: [titulo],
      datasets: (dataTipo || []).map((item, index) => ({
        label: item.descripcion,
        data: [item.total],
        backgroundColor: item.color ? withAlpha(item.color, '33') : colors[index % colors.length][0],
        borderColor: item.color || colors[index % colors.length][1],
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        borderRadius: 5,
        cutout: 30,
        hoverOffset: 16,
        offset: 10,
      }))
    };


  return (
    <Container>
      <section>
        <Bar data={datagrafica} options={options} />
      </section>
      <section>
        <h2>{titulo} por categoria</h2>
        <ContentTotal>
          <span>Total</span>
          <strong>{formatCurrency(totalGeneral)}</strong>
        </ContentTotal>
        {dataTipo.map((item, index) => (
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
