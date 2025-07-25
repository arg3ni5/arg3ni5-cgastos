import styled from "styled-components";
import { HashLoader } from "react-spinners";
export function SpinnerLoader() {
  return (
    <Container>
      <HashLoader color="#7f3ceb" size={200} />
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: ${({ theme }) => theme.bgtotal};
  transform: all 0.3s;
`;
