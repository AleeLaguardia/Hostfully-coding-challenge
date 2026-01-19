import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.alabaster};
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 40px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  .logo {
    width: 150px;
    align-self: center;
    margin-bottom: 20px;
  }
`;

export const Title = styled.h1`
  font-size: ${(props) => props.theme.sizes.l};
  font-weight: 600;
  color: ${(props) => props.theme.colors.purple};
  text-align: center;
  margin-bottom: 20px;
  font-family: ${(props) => props.theme.fonts.poppins};
`;

export const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.radicalRed};
  font-size: ${(props) => props.theme.sizes.xs};
  text-align: center;
  font-family: ${(props) => props.theme.fonts.poppins};
`;

export const LinkContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
  font-family: ${(props) => props.theme.fonts.poppins};
  font-size: ${(props) => props.theme.sizes.xs};

  a {
    color: ${(props) => props.theme.colors.purple};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
