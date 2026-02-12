import styled from "styled-components";

interface BtnfiltroProps {
  bgcolor: string;
  textcolor: string;
  icono: React.ReactNode;
  funcion: () => void;
}

interface ContainerProps {
  $bgcolor: string;
  $textcolor: string;
}

export const Btnfiltro: React.FC<BtnfiltroProps> = ({ bgcolor, textcolor, icono, funcion }) => {
  return (
    <Container $textcolor={textcolor} $bgcolor={bgcolor} onClick={funcion}>
      <div className="contentIcon">
        <span>{icono}</span>
      </div>
    </Container>
  );
};

const Container = styled.div<ContainerProps>`
  min-width: 50px;
  min-height: 50px;
  border-radius: 50%;
  background-color: ${(props) => props.$bgcolor};
  color: ${(props) => props.$textcolor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  position: relative;
  cursor: pointer;

  .contentIcon {
    position: absolute;
    top: 25%;
    bottom: 25%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    transition: 0.2s;
    &:hover {
      transform: scale(1.3);
    }
  }
`;
