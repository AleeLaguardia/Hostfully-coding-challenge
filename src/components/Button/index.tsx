import React from "react";
import { Container } from "./style";
import { theme } from "../../utils/theme";

interface Props {
  label: string;
  onClick?: () => void;
  color?: string;
  colorHover?: string;
  secondaryColor?: string;
  secondaryColorHover?: string;
  labelColor?: string;
  width?: string;
  borderColor?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<Props> = ({
  label,
  onClick,
  color = theme.colors.purple,
  colorHover = theme.colors.purpleHover,
  secondaryColor = theme.colors.white,
  secondaryColorHover = theme.colors.alabaster,
  labelColor = theme.colors.white,
  width = '',
  borderColor,
  type = 'button',
}) => {
  return (
    <Container
      type={type}
      onClick={onClick}
      color={color}
      colorHover={colorHover}
      labelColor={labelColor}
      width={width}
      borderColor={borderColor}
    >
      <span>{label}</span>
    </Container>
  );
};

export default Button;