import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-areas: 'content filler';
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.colors.galery};

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    grid-template-areas: 'content';
  }
`;

export const Filler = styled.div`
  display: flex;
  flex-direction: column; /* Garantir que os elementos estejam em coluna */
  grid-area: filler;
  height: 100%;
  width: 100%;
  position: relative; /* Para posicionar corretamente elementos absolutos */
  align-items: flex-start; /* Alinhar elementos no início por padrão */
  
  .filler-img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  
  & > :last-child {
    margin-top: auto; /* Empurra o último filho para o final do contêiner */
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const LogoImg = styled.img`
  position: absolute;
  bottom: 0; /* Posiciona o logo no fundo */
  right: 0; /* Posiciona o logo à direita */
  height: 200px !important;
  width: 200px !important;
  z-index: 3;
  object-fit: cover;
`;

export const Title = styled.div`
  position: absolute;
  display: flex;
  height: fit-content;
  width: fit-content;
  transform: rotate(10deg);
  top: 40px;

  span {
    font-family: ${(props) => props.theme.fonts.playwrite};
    font-weight: 600;
    color: ${(props) => props.theme.colors.white};
    font-size: 55px;
    font-style: italic;
  }
`;

export const Content = styled.div`
  grid-area: content;
  height: 100%;
  width: 100%;
`;

export const LandingContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.colors.lightPurple};
  top: 0;
`;

export const LandingLogo = styled.img`
  @keyframes bounceEffect {
    0% { transform: scale(1) },
    50% { transform: scale(1.3) },
    100% { transform: scale(1) }
  };

  height: 800px !important;
  width: 800px !important;
  object-fit: contain;
  animation: bounceEffect 2s ease-in-out;
  animation-iteration-count: 2;
`;