import styled from "styled-components";

export const Container = styled.div`
  @keyframes moveIn {
    0% { transform: translateX(-800px) };
    100% { transform: translateX(0) };
  };

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  animation: moveIn 1.3s;
`;

export const Logo = styled.img`
  height: 100px;
  object-fit: cover;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .title {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.emperor};
    font-size: ${(props) => props.theme.sizes.m};
  }
`;

export const DateInputContainer = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  justify-content: space-between;
  gap: 10px
`;

export const DateInput = styled.div<{ error: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  width: 160px;
  padding: 0 10px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 5px;
  border: ${(props) => props.error ? `1px solid ${props.theme.colors.radicalRed}` : 'none'};
  margin: 10px 0;
  cursor: pointer;

  span {
    color: ${(props) => props.theme.colors.purple};
    font-family: ${(props) => props.theme.fonts.poppins};
    font-size: ${(props) => props.theme.sizes.xs};
  }
`;

export const CalendarContainer = styled.div`
  position: absolute;
  display: flex;
  height: fit-content;
  width: fit-content;
  box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);
  border-radius: 40px;
  z-index: 3;
  margin-top: 40px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: fit-content;
  height: fit-content;
  margin-top: 50px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  width: 330px;
  height: fit-content;
  justify-content: flex-end;
  margin-top: 20px;
`;