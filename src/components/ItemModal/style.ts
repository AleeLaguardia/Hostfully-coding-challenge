import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: calc(30% - 5px) calc(70% - 5px);
  grid-template-rows: 1fr 1fr;
  grid-gap: 10px;
  padding: 10px;
  height: 600px;
  width: 700px;
  background-color: ${(props) => props.theme.colors.alabaster};
  border-radius: 15px;

  @media (max-width: 740px) {
    grid-template-columns: calc(40% - 5px) calc(60% - 5px);
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 10px;

  img {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
`;

export const MapContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 10px;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 10px;

  .title {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.purple};
    font-size: ${(props) => props.theme.sizes.xxxl};

    @media (max-width: 700px) {
      font-size: ${(props) => props.theme.sizes.l};
    }
  }

  .address {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.lightPurple};
    font-size: ${(props) => props.theme.sizes.s};

    @media (max-width: 700px) {
      font-size: ${(props) => props.theme.sizes.xs};
    }
  }

  .description {
    width: 70%;
    margin-top: 20px;
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.emperor};
    font-size: ${(props) => props.theme.sizes.xs};
    text-align: center;

    @media (max-width: 700px) {
      font-size: ${(props) => props.theme.sizes.xxxs};
      margin-top: 10px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      text-overflow: ellipsis;
      width: 100%;
    }
  }

  .price-container {
    border: 1px solid ${(props) => props.theme.colors.lynch};
    border-radius: 10px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0 10px;
    margin-top: auto;
    padding: 10px;

    span {
      font-family: ${(props) => props.theme.fonts.poppins};
      font-weight: 500;
      color: ${(props) => props.theme.colors.lynch};
      font-size: ${(props) => props.theme.sizes.xs};
    }
  }
`;

export const BookingContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  align-items: center;

  .input-container {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: row;
    gap: 10px;
  }
`;

export const BookingTitle = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;

  span {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.purple};
    font-size: ${(props) => props.theme.sizes.m};
  }
`;

export const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-between;

  .dropdown-container {
    position: relative;
    display: flex;
    margin-bottom: 10px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: fit-content;
  width: 100%;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 10px;
  margin-top: 5px;


  @media (max-width: 700px) {
    margin-top: 0;
  }
`;