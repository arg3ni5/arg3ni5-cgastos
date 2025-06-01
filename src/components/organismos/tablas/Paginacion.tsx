import { JSX, useState } from "react";
import { v } from "../../../styles/variables";
import styled from "styled-components";
interface PaginacionProps {
  color?: string;
  pagina: number;
  setPagina: (pagina: number) => void;
  maximo: number;
  bgCategoria?: string; 
  colorCategoria?: string;
}

interface ContainerProps {
  $bgCategoria: string;
  $colorCategoria: string;
}

export const Paginacion = ({ pagina, setPagina, maximo, color, bgCategoria, colorCategoria}: PaginacionProps): JSX.Element => {
  const [input, setInput] = useState<number>(1);

  const nextPage = (): void => {
    setInput(parseInt(input.toString()) + 1);
    setPagina(parseInt(pagina.toString()) + 1);
  };

  const previousPage = (): void => {
    setInput(parseInt(input.toString()) - 1);
    setPagina(parseInt(pagina.toString()) - 1);
  };

  const inicio = (): void => {
    setInput(1);
    setPagina(1);
  };

  return (
    <Container $bgCategoria={bgCategoria || ''} $colorCategoria={color || colorCategoria || ''}>
      <button onClick={inicio}>
        <span>{<v.iconotodos />}</span>
      </button>
      <button disabled={pagina === 1 || pagina < 1} onClick={previousPage}>
        <span className="iconoIzquierda">{<v.iconoflechaderecha />}</span>
      </button>
      <span>{input}</span>
      <p> de {Math.round(maximo)} </p>
      <button
        disabled={pagina === Math.ceil(maximo) || pagina > Math.ceil(maximo)}
        onClick={nextPage}
      >
        <span>{<v.iconoflechaderecha />}</span>
      </button>
    </Container>
  );
};

const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  button {
    background-color: ${(props) => props.$colorCategoria};
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-align: center;
    transition: 0.3s;

    &:hover {
      box-shadow: 0px 10px 15px -3px ${(props) => props.$colorCategoria};
    }
    .iconoIzquierda {
      transform: rotate(-180deg);
    }
    span {
      color: #fff;
      display: flex;
      svg {
        font-size: 15px;
        font-weight: 800;
      }
    }
  }

  button[disabled] {
    background-color: #646464;
    cursor: no-drop;
    box-shadow: none;
  }
`;
