import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface BtnFormProps {
  funcion?: () => void;
  className?: string;
  titulo: string;
  bgcolor: string;
  icono?: React.ReactNode;
  url?: string;
  type?: "button" | "submit" | "reset";
}

export const BtnForm: React.FC<BtnFormProps> = ({
  funcion,
  className,
  titulo,
  bgcolor,
  icono,
  url,
  type = "button"
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type === "submit") return; // permite que el formulario maneje el submit

    e.preventDefault(); // evita que se dispare el submit por accidente

    if (url) {
      navigate(url);
    } else if (funcion) {
      funcion();
    }
  };

  return (
    <Container type={type} $bgcolor={bgcolor} onClick={handleClick}>
      <div className={className || "btn"}><span className="icon">{icono}</span> <span>{titulo}</span></div>
    </Container>
  );
};

interface StyledButtonProps {
  $bgcolor: string;
}

const Container = styled.button<StyledButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  border: none;
  gap: 10px;
  background-color: initial;
  z-index: 2;
  cursor: pointer;

  .btn {
    background: ${(props) => props.$bgcolor};
    padding: 0.6em 1.3em;
    font-weight: 900;
    font-size: 18px;
    border: 3px solid black;
    border-radius: 0.4em;
    box-shadow: 0.1em 0.1em #000;
    transition: 0.2s;
    color: #000;
    white-space: nowrap;

    .icon {
      position: relative;
      top : 0.1em;
    }

    a {
      text-decoration: none;
      color: #000;
    }

    &:hover {
      transform: translate(-0.05em, -0.05em);
      box-shadow: 0.15em 0.15em #000;
    }

    &:active {
      transform: translate(0.05em, 0.05em);
      box-shadow: 0.05em 0.05em #000;
    }
  }
`;
