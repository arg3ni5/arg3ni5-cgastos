import { UseFormRegister, FieldErrors } from "react-hook-form";
import styled from "styled-components";

interface InputTextNumberProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  placeholder?: string;
  defaultValue?: number;
  style?: React.CSSProperties; // Added style prop
}

export const InputTextNumber = ({ label, name, register, errors, placeholder, defaultValue, style }: InputTextNumberProps) => (
  <InputContainer style={style}>
    <LabelText>{label}</LabelText>
    <StyledInput
      type="number"
      step="0.01" // For currency or precise numbers
      defaultValue={defaultValue}
      placeholder={placeholder}
      {...register(name, { required: `${label} es requerido`, valueAsNumber: true })}
    />
    {errors[name] && <ErrorMessage>{errors[name]?.message?.toString()}</ErrorMessage>}
  </InputContainer>
);

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const LabelText = styled.label`
  font-size: 0.9em;
  color: ${({ theme }) => theme.text};
`;

const StyledInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8em;
`;
