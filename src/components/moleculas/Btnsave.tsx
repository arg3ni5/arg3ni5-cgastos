import React from "react";
import styled from "styled-components";
import { Icono } from "../../index";
import { useNavigate } from "react-router-dom";

interface BtnsaveProps {
  funcion?: () => void;
  titulo: string;
  bgcolor: string;
  icono?: React.ReactNode;
  url?: string;
}

export const Btnsave: React.FC<BtnsaveProps> = ({ funcion, titulo, bgcolor, icono, url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (url) {
      navigate(url);
    } else if (funcion) {
      funcion();
    }
  };

  return (
    <Container type="button" $bgcolor={bgcolor} onClick={handleClick}>
      <Icono>{icono}</Icono>
      <span className="btn">{titulo}</span>
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
