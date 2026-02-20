import styled from "styled-components";
import { CSSProperties } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface InputTextProps {
  style?: CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  type?: string;
  name?: string;
  minLength?: number;
  label?: string;
}

export function InputText({
  style,
  onChange,
  defaultValue,
  placeholder,
  register,
  errors,
  minLength,
  type = "text",
  name = "descripcion",
  label,
}: InputTextProps) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <input
        style={style}
        // Remove onChange prop since it will be handled by register
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...register(name, { required: true, minLength })}
      />

      {errors[name]?.type === "required" && (
        <p>Campo requerido</p>
      )}
      {errors[name]?.type === "minLength" && (
        <p>Debe tener al menos 2 caracteres</p>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
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

const Label = styled.label`
  font-size: 0.9em;
  color: ${({ theme }) => theme.text};
`;
