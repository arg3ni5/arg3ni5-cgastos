import styled from "styled-components";

export function AccionTabla({ funcion, icono, color, fontSize }) {
  return <Container onClick={funcion} color={color} fontSize={fontSize}>{icono}</Container>;
}
const Container = styled.span`
color:${(props)=>props.color};
font-size:${(props)=>props.fontSize};
cursor: pointer;
// Increase button size on mobile devices
@media (max-width: 768px) { // Assuming 768px as a common breakpoint for mobile
  font-size: 24px !important; // Increase font size for icons
  padding: 8px; // Add padding for a larger touch target
}
`;
