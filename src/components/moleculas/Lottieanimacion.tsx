import { Player } from "@lottiefiles/react-lottie-player";
import styled from "styled-components";

interface LottieAnimacionProps {
  alto: number;
  ancho: number;
  animacion: any;
}

export function Lottieanimacion({ alto, ancho, animacion }: LottieAnimacionProps) {
  return (
    <Container>
      <Player
        autoplay
        loop
        src={animacion}
        style={{ height: `${alto}px`, width: `${ancho}px` }}
      />
    </Container>
  );
}

const Container = styled.div``;
