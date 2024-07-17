import styled from "styled-components";

export const Container = styled.button<{
  color?: string;
  colorHover?: string;
  labelColor?: string;
  width?: string;
  borderColor?: string;
}>`
  display: flex;
  height: 40px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.width ? '' : '7px 30px'};
  width: ${(props) => props.width || ''}; 
  background-color: ${(props) => props.color};
  border-radius: 5px;
  border: 2px solid ${(props) => props.borderColor ? props.borderColor : props.color};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.colorHover};
    border: 2px solid ${(props) => props.borderColor || props.colorHover};
  }

  span {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.labelColor};
    font-size: ${(props) => props.theme.sizes.s};
  }
`;