import styled from "styled-components";
import { Tipo } from "../../store/OperacionesStore";

interface BtnIconoProps {
  active?: boolean;
  tipo?: Tipo;
  icon?: string;
  icono?: string;
  text?: string;
  bgcolor?: string;
  textcolor?: string;
  funcion: () => void;
}

interface ContainerProps {
  $bgcolor: string;
  $textcolor: string;
}

export const BtnIcono: React.FC<BtnIconoProps> = ({ active, tipo, icono, text, bgcolor, textcolor, funcion }) => {
  return (
    <Container
      $bgcolor={tipo?.bgcolor || bgcolor || ''}
      $textcolor={tipo?.color || textcolor || ''}
      onClick={funcion}>
      <span className="containerText">
        {tipo?.icono || icono}
        <h6>{tipo?.text || text}</h6>
      </span>
    </Container>
  );
};

const Container = styled.div<ContainerProps>`
font-weight: 500;
letter-spacing: 0.3px;

  display: flex;
  background-color: ${(props) => props.$bgcolor};
  color: ${(props) => props.$textcolor};
  font-weight: 500;
  font-size: 23px;
  padding: 0.9rem 2.3rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  .containerText {
    gap: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &:hover {
    background-color: #fff;
  }
`;
