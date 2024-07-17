import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import LogoIcon from '../../assets/purple-logo-1.png';
import ArrowIcon from '../../assets/icons/white-arrow.svg';
import UserIcon from '../../assets/icons/user.svg';
import CardIcon from '../../assets/icons/card.svg';
import MailIcon from '../../assets/icons/mail.svg';
import PhoneIcon from '../../assets/icons/phone.svg';
import { RootState } from "../../store";
import { Hotel } from "../../utils/types/hotelTypes";
import MapComponent from "../../components/MapComponent";
import { ButtonContainer, CalendarContainer, Container, Content, Header, HotelDetailModal, HotelDetails, InputContainer, Item, ItemContainer, Logo, ShadowContainer } from "./style";
import Input from "../../components/Input";
import { theme } from "../../utils/theme";
import CalendarComponent from "../../components/CalendarComponent";
import useClickOutside from "../../utils/hooks/useClickOutside";
import { DisplayElement } from "../../components/InputCollection/style";
import Button from "../../components/Button";
import { addReservation, deleteReservation, updateReservation } from "../../store/slice/reservationSlice";

interface Props {}

type ReservationSelected = {
  name: string;
  phone: string;
  email: string;
  paymentMethod: string;
  date: any;
  hotel: Hotel;
}

const Reservation: React.FC<Props> = () => {
  const reservation = useSelector((state: RootState) => state.reservation);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [hotelSelected, setHotelSelected] = useState<ReservationSelected>(reservation[0] || []);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const calendarRef = useClickOutside(() => setIsCalendarOpen(false));

  const validateExistingBooking = () => {
    const dispatchReservation = () => {
      if (hotelSelected.name.length > 0 && hotelSelected.phone.length > 0 && hotelSelected.email.length > 0) {
        const hotelIndex = reservation.findIndex((el) => el.hotel === hotelSelected?.hotel);

        dispatch(updateReservation({
          index: hotelIndex,
          reservation: { 
            ...reservation,
            name: hotelSelected.name,
            phone: hotelSelected.phone,
            email: hotelSelected.email,
            date: hotelSelected.date,
          }
        }))
      }
    }
  
    const formatSelectedHotelDate = [format(hotelSelected.date[0], 'MM/dd/yyyy'), format(hotelSelected.date[1], 'MM/dd/yyyy')];
  
    const isExistingBooking = reservation.some((el) => {
      const formatFoundHotelDate = [format(el.date[0], 'MM/dd/yyyy'), format(el.date[1], 'MM/dd/yyyy')];
      const areDatesEqual = formatSelectedHotelDate.every((date, index) => date === formatFoundHotelDate[index]);
  
      return el.hotel.HotelName === hotelSelected.hotel.HotelName && areDatesEqual;
    });
  
    if (isExistingBooking) {
      alert("There is already a reservation with the same date");
    } else {
      dispatchReservation();
    }
  }

  const handleSelectHotel = (hotel: ReservationSelected) => {
    setHotelSelected(hotel);
    setIsModalOpen(true);
  }

  const handleDeleteReservation = () => {
    if (reservation.length > 0) {
      const hotelIndex = reservation.findIndex((el) => el.hotel === hotelSelected?.hotel);

      dispatch(deleteReservation(hotelIndex));
      setIsModalOpen(false);
    }
    setHotelSelected(reservation[0] || {});
  }

  const handleUpdateReservation = () => {
    if (reservation.length > 0) {
      validateExistingBooking();
    }
  }

  useEffect(() => {
    setHotelSelected((prevState) => ({ ...prevState, date: user.date }));
  }, [user.date])

  return (
    <Container>
      <Header>
        <Logo src={LogoIcon} alt="LogoIcon" />
        <div onClick={() => navigate(-1)} className="back-button-container">
          <img src={ArrowIcon} alt="ArrowIcon" />
        </div>
      </Header>
      <Content>
        <ItemContainer>
          {reservation.length > 0 ? reservation.map((item, index) => (
            <Item onClick={() => handleSelectHotel(item)}>
              <img className="hotel-img" src={item.hotel.ImageSource} alt="ImageSource" />
              <div className="hotel-name">
                <span>{item.hotel.HotelName}</span>
                <span className="address">{item.hotel.Address.City}, {item.hotel.Address.StateProvince}</span>
                <span className="date">{format(item.date[0], 'MM/dd/yyyy')} - {format(item.date[1], 'MM/dd/yyyy')}</span>
              </div>
              <div className="user-info">
                <div className="display">
                  <span>{item.name}</span>
                  <img src={UserIcon} alt="UserIcon" />
                </div>
                <div className="display">
                  <span>{item.phone}</span>
                  <img src={PhoneIcon} alt="PhoneIcon" />
                </div>
                <div className="display">
                  <span>{item.email}</span>
                  <img src={MailIcon} alt="MailIcon" />
                </div>
                <div className="display">
                  <span>{item.paymentMethod}</span>
                  <img src={CardIcon} alt="CardIcon" />
                </div>
              </div>
            </Item>
          )) : null}
        </ItemContainer>
        {reservation.length > 0 && (
          <HotelDetails>
            <div className="img-container">
              <img src={hotelSelected?.hotel.ImageSource || ""} alt="ImageSource" />
            </div>
            <div className="map-container">
              <MapComponent position={hotelSelected?.hotel.Location.coordinates} />
            </div>
            <div className="info-container">
              <span className="header">Update Information</span>
              <InputContainer ref={calendarRef}>
                <Input
                  backgroundColor={theme.colors.alabaster}
                  placeholder="Full Name"
                  value={hotelSelected?.name}
                  onChange={(e) => setHotelSelected((prevState) => ({ ...prevState, name: e.target.value }))}
                  error={false}
                />
                <Input
                  backgroundColor={theme.colors.alabaster}
                  placeholder="Phone Number"
                  value={hotelSelected?.phone}
                  onChange={(e) => setHotelSelected((prevState) => ({ ...prevState, phone: e.target.value }))}
                  error={false}
                />
                <Input
                  backgroundColor={theme.colors.alabaster}
                  placeholder="Email"
                  value={hotelSelected?.email}
                  onChange={(e) => setHotelSelected((prevState) => ({ ...prevState, email: e.target.value }))}
                  error={false}
                />
                <DisplayElement onClick={() => setIsCalendarOpen(true)} backgroundColor={theme.colors.alabaster}>
                  <span>{`${format(hotelSelected?.date[0], 'MM/dd/yyyy')} - ${format(hotelSelected?.date[1], 'MM/dd/yyyy')}`}</span>
                </DisplayElement>
                {isCalendarOpen && (
                  <CalendarContainer>
                    <CalendarComponent isOpen={isCalendarOpen} setIsOpen={setIsCalendarOpen} />
                  </CalendarContainer>
                )}
                <ButtonContainer>
                  <Button
                    color={theme.colors.white}
                    colorHover={theme.colors.galery}
                    labelColor={theme.colors.selectiveYellow}
                    onClick={handleDeleteReservation}
                    label="Delete"
                    width="100%"
                    borderColor={theme.colors.selectiveYellow}
                  />
                  <Button
                    color={theme.colors.selectiveYellow}
                    colorHover={theme.colors.chelseaGem}
                    onClick={handleUpdateReservation}
                    label="Update"
                    width="100%"
                  />
                </ButtonContainer>
              </InputContainer>
            </div>
          </HotelDetails>
        )}
      </Content>
      {isModalOpen && (
        <ShadowContainer onClick={() => setIsModalOpen(false)}>
          <HotelDetailModal onClick={(e) => e.stopPropagation()}>
            <div className="img-container">
              <img src={hotelSelected?.hotel.ImageSource || ""} alt="ImageSource" />
            </div>
            <div className="map-container">
              <MapComponent position={hotelSelected?.hotel.Location.coordinates} />
            </div>
            <div className="info-container">
              <span className="header">Update Information</span>
              <InputContainer>
                <Input
                  backgroundColor={theme.colors.alabaster}
                  placeholder="Full Name"
                  value={hotelSelected?.name}
                  onChange={(e) => setHotelSelected((prevState) => ({ ...prevState, name: e.target.value }))}
                  error={false}
                />
                <Input
                  backgroundColor={theme.colors.alabaster}
                  placeholder="Phone Number"
                  value={hotelSelected?.phone}
                  onChange={(e) => setHotelSelected((prevState) => ({ ...prevState, phone: e.target.value }))}
                  error={false}
                />
                <Input
                  backgroundColor={theme.colors.alabaster}
                  placeholder="Email"
                  value={hotelSelected?.email}
                  onChange={(e) => setHotelSelected((prevState) => ({ ...prevState, email: e.target.value }))}
                  error={false}
                />
                <DisplayElement onClick={() => setIsCalendarOpen(true)} backgroundColor={theme.colors.alabaster}>
                  <span>{`${format(hotelSelected?.date[0], 'MM/dd/yyyy')} - ${format(hotelSelected?.date[1], 'MM/dd/yyyy')}`}</span>
                </DisplayElement>
                {isCalendarOpen && (
                  <CalendarContainer>
                    <CalendarComponent isOpen={isCalendarOpen} setIsOpen={setIsCalendarOpen} />
                  </CalendarContainer>
                )}
                <ButtonContainer>
                  <Button
                    color={theme.colors.white}
                    colorHover={theme.colors.galery}
                    labelColor={theme.colors.selectiveYellow}
                    onClick={handleDeleteReservation}
                    label="Delete"
                    width="100%"
                    borderColor={theme.colors.selectiveYellow}
                  />
                  <Button
                    color={theme.colors.selectiveYellow}
                    colorHover={theme.colors.chelseaGem}
                    onClick={handleUpdateReservation}
                    label="Update"
                    width="100%"
                  />
                </ButtonContainer>
              </InputContainer>
            </div>
          </HotelDetailModal>
        </ShadowContainer>
      )}
    </Container>
  );
};

export default Reservation;