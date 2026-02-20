import styled from "styled-components";
import { v } from "../../index";

interface BtndesplegableProps {
  icono?: string;
  text: string;
  bgcolor: string;
  textcolor: string;
  active?: boolean;
  funcion: () => void;
}

interface ContainerProps {
  $bgcolor: string;
  $textcolor: string;
  $bordercolor: string;
  $active: boolean;
}

const ajustarColor = (color: string, factor: number): string => {
  if (!color.startsWith("#") || (color.length !== 7 && color.length !== 4)) {
    return color;
  }

  const hex = color.length === 4
    ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    : color;

  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, Math.round(((num >> 16) & 255) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((num >> 8) & 255) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((num & 255) * factor)));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const Btndesplegable: React.FC<BtndesplegableProps> = ({ icono, text, bgcolor, textcolor, active, funcion }) => {
  const borderColor = active ? ajustarColor(bgcolor, 0.85) : "transparent";
  return (
    <Container
      $bgcolor={bgcolor}
      $textcolor={textcolor}
      $bordercolor={borderColor}
      $active={!!active}
      onClick={funcion}
    >
      <span className="containerText">
        {<v.iconoFlechabajo />}

        {icono}
        <h6>{text}</h6>
      </span>
    </Container>
  );
};

const Container = styled.div<ContainerProps>`
  display: flex;
  background-color: ${(props) => props.$bgcolor};
  color: ${(props) => props.$textcolor};
  border: 2px solid ${(props) => (props.$active ? props.$bordercolor : "transparent")};
  font-weight: 500;
  font-size: 23px;
  padding: 0.9rem 2.3rem;
  border-radius: 50px;
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
