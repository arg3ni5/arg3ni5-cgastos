import styled from "styled-components";
import { Device, v, BtnCerrar } from "../../index";
import { JSX } from "react";

interface ListaGenericaProps {
  data: Array<{
    icono: React.ReactNode;
    descripcion: string;
    [key: string]: any;
  }>;
  setState: () => void;
  funcion: (item: any) => void;
  scroll?: string;
  bottom?: string;
}

interface ContainerProps {
  scroll?: string;
  $bottom?: string;
}

export const ListaGenerica = ({ data, setState, funcion, scroll, bottom }: ListaGenericaProps): JSX.Element => {
  const seleccionar = (p: any): void => {
    funcion(p);
    setState();
  };

  return (
    <Container scroll={scroll} $bottom={bottom}>
      <section className="contentClose">
        <BtnCerrar funcion={setState} />
      </section>
      <section className="contentItems">
        {data.map((item, index) => (
          <ItemContainer key={index} onClick={() => seleccionar(item)}>
            <span>{item.icono}</span>
            <span>{item.descripcion}</span>
          </ItemContainer>
        ))}
      </section>
    </Container>
  );
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  position: absolute;
  margin-bottom: 15px;
  bottom: ${(props)=>props.$bottom};
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  gap: 10px;
  z-index: 3;
  @media ${() => Device.tablet} {
    width: 400px;
  }
  .contentItems {
    overflow-y: ${(props) => props.scroll};
  }
`;
const ItemContainer = styled.div`
  gap: 10px;
  display: flex;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.bgtotal};
  }
`;
