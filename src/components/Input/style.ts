import styled from "styled-components";

export const Container = styled.input<{ error: boolean, backgroundColor?: string }>`
  height: 40px;
  width: 100%;
  padding: 0 10px;
  background-color: ${(props) => props.backgroundColor ? props.backgroundColor : props.theme.colors.white};
  border-radius: 5px;
  border: ${(props) => props.error ? `1px solid ${props.theme.colors.radicalRed}` : 'none'};
  color: ${(props) => props.theme.colors.purple};
  font-family: ${(props) => props.theme.fonts.poppins};
  font-size: ${(props) => props.theme.sizes.xs};
  margin: 10px 0;

  &:placeholder {
    color: ${(props) => props.theme.colors.gray};
  }
`;