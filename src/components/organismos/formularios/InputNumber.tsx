import { CSSProperties, JSX, ReactNode } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import styled from "styled-components";

interface InputNumberProps {
  style?: CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: number;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  icono?: ReactNode;
}

export const InputNumber = ({
  style,
  onChange,
  defaultValue,
  placeholder,
  register,
  errors,
  icono
}: InputNumberProps): JSX.Element => {
  return (
    <Container>
      <ContainerTextoicono>
        <span>{icono}</span>
        <input
          step="0.01"
          style={style}
          type="number"
          defaultValue={defaultValue}
          placeholder={placeholder}
          {...register("monto", { 
            required: true,
            valueAsNumber: true,
            validate: (value) => !isNaN(value) || "Please enter a valid number"
          })}
        />
      </ContainerTextoicono>

      {errors.valor?.type === "required" && (
        <p>Campo requerido</p>
      )}
      {errors.valor?.type === "Number" && (
        <p>Ingrese un número valido</p>
      )}
    </Container>
  );
};
const Container = styled.div`
  position: relative;
  display:flex;
  align-items:start;
  flex-direction:column;
  justify-content:start;
  input {
    background: ${({ theme }) => theme.bgtotal};
    font-size: 16px;
    padding: 10px 10px 10px 5px;
    display: block;
    width: 100%;
    border: none;
    border-bottom: solid 1px grey;
    color: ${({ theme }) => theme.text};
    outline: none;
    &:focus {
      border-bottom: none;
    }
    &::placeholder {
      color: #c8c8c8;
    }
  }
  p {
    color: #ff6d00;
    font-size: 12px;
  }
`;

const ContainerTextoicono = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  text-align:center;`;