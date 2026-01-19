import React from "react";
import { Container } from "./style";

interface Props {
  error: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  value?: string | number | readonly string[];
  backgroundColor?: string;
  type?: 'text' | 'password' | 'email';
};

const Input: React.FC<Props> = ({ error, onChange, value, placeholder, backgroundColor, type = 'text' }) => {
  return (
    <Container
      type={type}
      backgroundColor={backgroundColor}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      value={value}
    />
  );
};

export default Input;