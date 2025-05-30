import styled from "styled-components";
import { v } from "../../index";
import { JSX } from "react";

interface BtnCerrarProps {
  funcion: () => void;
}

export const BtnCerrar = ({ funcion }: BtnCerrarProps): JSX.Element => {
  return <Container onClick={funcion}>{<v.iconocerrar />}</Container>;
};

const Container = styled.span`
  cursor: pointer;
  font-size: 25px;
  transition: all 0.2s;
  &:hover {
    color: ${() => v.colorselector};
    transform: scale(1.2);
  }
`;
