import React, { useEffect, useState } from "react";
import ReservationForm from "../../components/ReservationForm";
import FillerPic from '../../assets/filler-pic.jpeg';
import LogoIcon from '../../assets/logo-main.png';
import PurpleLogo from '../../assets/purple-logo-1.png';
import { HOME } from "../../utils/strings";
import { Container, Content, Filler, LandingContainer, LandingLogo, LogoImg, Title } from "./style";

interface Props {}

const LandingPage: React.FC = () => {
  return (
    <LandingContainer>
      <LandingLogo draggable={false} src={PurpleLogo} alt="PurpleLogo" />
    </LandingContainer>
  )
}

const Home: React.FC<Props> = () => {
  const [landingPage, setLandingPage] = useState<boolean>(false);

  useEffect(() => {
    const isFirstEntry = localStorage.getItem('isFirstEntry');

    if (isFirstEntry) {
      setLandingPage(false);
    } else {
      setLandingPage(true);
      setTimeout(() => {
        setLandingPage(false);
        localStorage.setItem('isFirstEntry', JSON.stringify(false));
      }, 4000);
    }
  }, []);

  return (
    <>
      {landingPage ? <LandingPage /> : (
        <Container>
          <Filler>
            <img draggable={false} className="filler-img" src={FillerPic} alt="FillerPic" />
            <LogoImg draggable={false} src={LogoIcon} alt="LogoIcon" />
          </Filler>
          <Content>
            <ReservationForm />
          </Content>
        </Container>
      )}
    </>
  );
};

export default Home;