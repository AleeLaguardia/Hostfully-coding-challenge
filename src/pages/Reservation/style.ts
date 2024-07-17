import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100vw;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.lightPurple};
  min-height: 120px;
  width: 100%;

  .back-button-container {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    margin: 10px 0 0 10px;
    height: fit-content;
    padding: 10px;
    width: fit-content;
    cursor: pointer;
    border-radius: 100%;
    transform: rotate(90deg);

    &:hover {
      background-color: ${(props) => props.theme.colors.purple};
    }
  }
`;

export const Logo = styled.img`
  height: 80px;
  width: fit-content;
  object-fit: cover;
`;

export const Content = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'items details';
  grid-gap: 10px;
  height: 100%;
  width: 100%;
  padding: 0 10px;
  background-color: ${(props) => props.theme.colors.galery};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-areas: 'items';
    grid-gap: 0;
  }
`;

export const ItemContainer = styled.div`
  grid-area: items;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  width: 100%;
`;

export const Item = styled.div`
  display: flex;
  width: 100%;
  min-height: 120px;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 10px;
  cursor: pointer;

  .hotel-img {
    height: 100px;
    width: 100px;
    border-radius: 5px;
  }

  .hotel-name {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    height: 100%;

    span {
      font-family: ${(props) => props.theme.fonts.poppins};
      font-weight: 500;
      color: ${(props) => props.theme.colors.purple};
      font-size: ${(props) => props.theme.sizes.m};
    }

    .address {
      font-size: ${(props) => props.theme.sizes.xs};
      color: ${(props) => props.theme.colors.lightPurple};
    }

    .date {
      font-size: ${(props) => props.theme.sizes.xs};
      color: ${(props) => props.theme.colors.lightPurple};
      margin-top: auto;
    }
  }

  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    margin-left: auto;
    height: 100%;
    width: fit-content;

    .display {
      display: flex;
      height: fit-content;
      width: fit-content;
      align-items: center;
    }

    span {
      font-family: ${(props) => props.theme.fonts.poppins};
      font-weight: 400;
      color: ${(props) => props.theme.colors.emperor};
      font-size: ${(props) => props.theme.sizes.xs};
      margin-right: 5px;
    }
  }
`;

export const HotelDetails = styled.div`
  grid-area: details;
  position: sticky;
  top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 2fr;
  height: calc(100vh - 130px);
  width: 100%;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 10px;
  grid-gap: 10px;
  display: none;

  @media (min-width: 900px) {
    display: grid;
  }

  .img-container {
    display: flex;
    max-height: 210px;
    width: 100%;

    img {
      width: 100%;
      border-radius: 10px;
      object-fit: cover;
    }
  }

  .map-container {
    display: flex;
    height: 100%;
    width: 100%;
    border-radius: 10px;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-column: 1 / span 2;
    height: 100%;
    width: 100%;
    margin-top: 20px;

    .header {
      font-family: ${(props) => props.theme.fonts.poppins};
      font-weight: 500;
      color: ${(props) => props.theme.colors.purple};
      font-size: ${(props) => props.theme.sizes.xl};
    }
  }
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: fit-content;
  margin-top: 20px;
`;

export const CalendarContainer = styled.div`
  position: absolute;
  height: fit-content;
  width: fit-content;
  z-index: 4;
  border-radius: 40px;
  box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);
`;

export const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: auto;
  height: fit-content;
  gap: 10px;
  margin-top: 5px;
`;

export const ShadowContainer = styled.div`
  @keyframes fadeIn {
    from { opacity: 0 },
    to { opacity: 1 }
  };

  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #000000AA;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.15s ease-in-out;
  padding: 10px;

  @media (min-width: 900px) {
    display: none;
  }
`;

export const HotelDetailModal = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 2fr;
  height: calc(100vh - 130px);
  width: 100%;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 10px;
  grid-gap: 10px;

  .img-container {
    display: flex;
    max-height: 210px;
    width: 100%;

    img {
      width: 100%;
      border-radius: 10px;
      object-fit: cover;
    }
  }

  .map-container {
    display: flex;
    height: 100%;
    width: 100%;
    border-radius: 10px;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-column: 1 / span 2;
    height: 100%;
    width: 100%;
    margin-top: 20px;

    .header {
      font-family: ${(props) => props.theme.fonts.poppins};
      font-weight: 500;
      color: ${(props) => props.theme.colors.purple};
      font-size: ${(props) => props.theme.sizes.xl};
    }
  }
`;