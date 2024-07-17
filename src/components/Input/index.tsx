import React from "react";
import { Container } from "./style";

interface Props {
  error: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  value?: string | number | readonly string[];
  backgroundColor?: string;
};

const Input: React.FC<Props> = ({ error, onChange, value, placeholder, backgroundColor }) => {
  return (
    <Container
      backgroundColor={backgroundColor}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      value={value}
    />
  );
};

export default Input;