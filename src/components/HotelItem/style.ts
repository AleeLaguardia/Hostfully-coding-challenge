import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  min-height: 260px;
  height: 260px;
  width: 100%;
  border-radius: 15px;
  border: 1px solid ${(props) => props.theme.colors.alto};
  padding: 12px 10px;
  margin: 10px 0;
  transition: 0.15s;
  cursor: pointer;

  @media (max-width: 1000px) {
    min-height: 160px;
    height: 160px;
  }

  @media (max-width: 600px) {
    min-height: 130px;
    height: 130px;
  }
`;

export const Image = styled.img`
  height: 236px;
  width: 236px;
  object-fit: cover;
  border-radius: 10px;
  transition: 0.15s;

  @media (max-width: 1000px) {
    height: 136px;
    width: 136px;
  }

  @media (max-width: 600px) {
    height: 106px;
    width: 106px;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 10px;
  width: 50%;
  justify-content: space-between;

  .name-container {
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 100%;
  }

  .name {
    font-size: ${(props) => props.theme.sizes.xxxl};
    color: ${(props) => props.theme.colors.purple};
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;

    @media (max-width: 600px) {
      font-size: ${(props) => props.theme.sizes.m};
    }
  }

  .description {
    font-size: ${(props) => props.theme.sizes.xs};
    color: ${(props) => props.theme.colors.emperor};
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    height: 55px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;

    @media (max-width: 600px) {
    height: 35px;
    -webkit-line-clamp: 2;
    }
  }

  .address {
    font-size: ${(props) => props.theme.sizes.xs};
    color: ${(props) => props.theme.colors.lynch};
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;  
  }
`;

export const RatingContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 10px;


  @media (max-width: 700px) {
    padding: 0 0 0 10px;    
  }
`;

export const Rating = styled.div`
  display: flex;
  height: fit-content;
  width: fit-content;
  align-items: center;

  .price-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: fit-content;
    height: fit-content;
    background-color: ${(props) => props.theme.colors.purple};
    padding: 5px;
    border-radius: 10px;
    padding-right: 10px;

    @media (max-width: 600px) {
      display: none;
    }
  }

  span {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.lynch};
    margin-left: 5px;
  }

  .rate {
    font-size: ${(props) => props.theme.sizes.m};
  }

  .price {
    font-size: ${(props) => props.theme.sizes.s};
    color: ${(props) => props.theme.colors.white};
    font-weight: 400;

    @media (max-width: 700px) {
      font-size: ${(props) => props.theme.sizes.xxs};
    }
  }
`