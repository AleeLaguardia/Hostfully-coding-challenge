import React from "react";
import { Container, Image, InfoContainer, Rating, RatingContainer } from "./style";
import StarIcon from '../../assets/icons/star.svg';
import { Hotel } from "../../utils/types/hotelTypes";

interface Props {
  hotel: Hotel;
  onClick: () => void;
  totalPrice: string;
}

const HotelItem: React.FC<Props> = ({ hotel, onClick, totalPrice }) => {
  const { StreetAddress, City, StateProvince } = hotel.Address;
  
  return (
    <Container onClick={onClick} key={hotel.HotelId}>
      <Image draggable={false} src={hotel?.ImageSource || ''} alt="source-image" />
      <InfoContainer>
        <div className="name-container">
          <span className="name">{hotel.HotelName}</span>
          <span className="description">{hotel.Description}</span>
        </div>
        <span className="address">{StreetAddress}, {City}, {StateProvince}</span>
      </InfoContainer>
      <RatingContainer>
        <Rating>
          <img src={StarIcon} alt="StarIcon" />
          <span className="rate">{hotel.Rating}</span>
        </Rating>
        <Rating>
          <div className="price-container">
            <span className="price">$ {hotel.Rooms[0].BaseRate} night</span>
            <span className="price">{totalPrice} total</span>
          </div>
        </Rating>
      </RatingContainer>
    </Container>
  );
};

export default HotelItem