import styled from "styled-components";
import { AccionTabla } from "../../../index";
import { v } from "../../../styles/variables";
import { JSX } from "react";

interface ContentAccionesTablaProps {
  funcionEditar: () => void;
  funcionEliminar: () => void;
}

export const ContentAccionesTabla = ({ funcionEditar, funcionEliminar }: ContentAccionesTablaProps): JSX.Element => {
  return (
    <Container>
      <AccionTabla funcion={funcionEditar} fontSize="18px" color="#7d7d7d" icono={<v.iconeditarTabla />} />
      <AccionTabla funcion={funcionEliminar} fontSize="20px" color="#f76e8e" icono={<v.iconeliminarTabla />} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  @media (max-width: 48em) {
    justify-content: end;
  }
  // Increase button size on mobile devices
  @media (max-width: 768px) { // Assuming 768px as a common breakpoint for mobile
    gap: 15px; // Increase gap for better spacing

    & > div { // Target the div element inside Container
      font-size: 24px !important; // Increase font size for icons
      padding: 8px !important; // Add padding for a larger touch target
    }
  }
`;
