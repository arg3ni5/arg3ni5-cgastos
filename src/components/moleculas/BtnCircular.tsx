import { ReactNode } from "react";
import styled from "styled-components";

interface BtnCircularProps {
  icono: ReactNode;
  width: string;
  height: string;
  bgcolor: string;
  textcolor: string;
  fontsize: string;
  translatex: string;
  translatey: string;
}
export const BtnCircular = ({
  icono,
  width,
  height,
  bgcolor,
  textcolor,
  fontsize,
  translatex,
  translatey,
}: BtnCircularProps) => {
  return (
    <Container
      $bgcolor={bgcolor}
      $textcolor={textcolor}
      height={height}
      width={width}
      $fontsize={fontsize}
      $translatex={translatex}
      $translatey={translatey}
    >
      <span>{icono}</span>
    </Container>
  );
}

interface ContainerProps {
  width: string;
  height: string;
  $bgcolor: string;
  $textcolor: string;
  $fontsize: string;
  $translatex: string;
  $translatey: string;
}

const Container = styled.div<ContainerProps>`
  background: ${(props) => props.$bgcolor};
  min-width: ${(props) => props.width};
  min-height: ${(props) => props.height};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transform: translateX(${(props) => props.$translatex})
    translateY(${(props) => props.$translatey});

  span {
    font-size: ${(props) => props.$fontsize};
    text-align: center;
    color: ${(props) => props.$textcolor};
  }
`;
