import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: 'destination date people';
  grid-gap: 10px;
  height: 60px;
  width: 900px;
  background-color: ${(props) => props.theme.colors.purple};
  border-radius: 10px;
  padding: 0 10px;
  box-shadow: 0px 10px 5px 0px rgba(0,0,0,0.2);

  @media (max-width: 1000px) {
    width: 95vw;
    margin: 0 20px;
  }
`;

export const DestinationInputContainer = styled.div`
  grid-area: destination;
  height; 100%;
  width: 100%;
`;

export const DateInputContainer = styled.div`
  grid-area: date;
  height; 100%;
  width: 100%;
`;

export const DisplayElement = styled.div<{ backgroundColor?: string }>`
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  padding: 0 10px;
  background-color: ${(props) => props.backgroundColor ? props.backgroundColor : props.theme.colors.white};
  border-radius: 5px;
  margin: 10px 0;
  cursor: pointer;

  span {
    color: ${(props) => props.theme.colors.purple};
    font-family: ${(props) => props.theme.fonts.poppins};
    font-size: ${(props) => props.theme.sizes.xs};
  }
`;

export const PeopleInputContainer = styled.div`
  grid-area: people;
  height; 100%;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  grid-area: button;
  height; 100%;
  width: 100%;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.selectiveYellow};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 10px 0;

  &:hover {
    background-color: ${(props) => props.theme.colors.chelseaGem};
  }

  span {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.white};
    font-size: ${(props) => props.theme.sizes.s};
    text-transform: uppercase;
  }
`;

export const CalendarContainer = styled.div`
  position: absolute;
  display: flex;
  height: fit-content;
  width: fit-content;
  box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);
  border-radius: 40px;
  margin-top: 10px;
  left: 50px;
`;