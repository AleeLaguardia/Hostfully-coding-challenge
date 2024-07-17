import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100vw;
  align-items: center;
  overflow: auto;
  background-color: ${(props) => props.theme.colors.galery};
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.colors.lightPurple};
  height: 200px;
  width: 100%;

  .reservation-button-container {
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
    border-radius: 10px;

    &:hover {
      background-color: ${(props) => props.theme.colors.purple};
    }

    span {
      font-family: ${(props) => props.theme.fonts.poppins};
      font-weight: 500;
      color: ${(props) => props.theme.colors.white};
      font-size: ${(props) => props.theme.sizes.m};
      margin-left: 5px;

      @media (max-width: 700px) {
        display: none;
      }
    }
  }
`;

export const InputContainer = styled.div`
  position: absolute;
  display: flex;
  height: fit-content;
  width: fit-content;
  top: 170px;
`;

export const Logo = styled.img`
  height: 100px;
  width: fit-content;
  object-fit: cover;
  margin-top: 10px;
`;

export const Content = styled.div<{ dataAvailable: boolean }>`
  @keyframes fadeIn {
    from { opacity: 0; },
    to { opacity: 1; }
  };

  display: flex;
  flex-direction: column;
  width: 900px;
  height: 100%;
  margin-top: 40px;
  opacity: 1;
  animation: ${(props) => props.dataAvailable && 'fadeIn 0.3s ease-in-out'};

  @media (max-width: 1000px) {
    width: 100%;
    padding: 0 20px;
  }
`

export const ShadowContainer = styled.div`
  @keyframes fadeIn {
    from { opacity: 0 },
    to { opacity: 1 }
  };

  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #000000AA;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.15s ease-in-out;

  @media (max-width: 740px) {
    padding: 0 20px;
  }
`;

export const MissingEndpointModal = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 500px;
  width: 500px;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 15px;
  padding: 70px 30px;

  span {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.lynch};
    font-size: ${(props) => props.theme.sizes.xs};
  }

  .title {
    font-size: ${(props) => props.theme.sizes.xl};
    color: ${(props) => props.theme.colors.purple};
  }
`;

export const NoDataContainer = styled.div`
  display: flex;
  height: fit-content;
  justify-content: center;
  width: 100%;
  padding: 50px 30px;

  span {
    font-family: ${(props) => props.theme.fonts.poppins};
    font-weight: 500;
    color: ${(props) => props.theme.colors.purple};
    font-size: ${(props) => props.theme.sizes.m};
  }
`;