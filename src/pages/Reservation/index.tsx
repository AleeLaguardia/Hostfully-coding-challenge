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
import { ButtonContainer, CalendarContainer, Container, Content, Header, HotelDetailModal, HotelDetails, InputContainer, Item, ItemContainer, Logo, ProfileContainer, ShadowContainer } from "./style";
import Input from "../../components/Input";
import { theme } from "../../utils/theme";
import CalendarComponent from "../../components/CalendarComponent";
import useClickOutside from "../../utils/hooks/useClickOutside";
import { DisplayElement } from "../../components/InputCollection/style";
import Button from "../../components/Button";
import { deleteReservation, updateReservation } from "../../store/slice/reservationSlice";
import { deleteReservationApi } from "../../api/auth";
import AuthHeader from "../../components/AuthHeader";

interface Props {}

type ReservationSelected = {
  id?: string;
  userId?: string;
  name: string;
  phone: string;
  email: string;
  paymentMethod: string;
  date: any;
  hotel: Hotel;
}

const Reservation: React.FC<Props> = () => {
  const reservation = useSelector((state: RootState) => state.reservation);
  const searchParams = useSelector((state: RootState) => state.user);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userReservations = reservation.filter((r: any) => r.userId === authUser?.id);
  
  const [hotelSelected, setHotelSelected] = useState<ReservationSelected>(userReservations[0] || {});
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const calendarRef = useClickOutside(() => setIsCalendarOpen(false));

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 10);

    if (limited.length <= 3) {
      return limited.length > 0 ? `(${limited}` : '';
    }
    if (limited.length <= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    }
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  };

  const validatePhone = (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 10;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setHotelSelected((prevState) => ({ ...prevState, phone: formatted }));
  };

  const validateExistingBooking = async () => {
    if (hotelSelected.name.length === 0 || hotelSelected.phone.length === 0 || hotelSelected.email.length === 0) {
      alert('Please fill all fields');
      return;
    }

    if (!validatePhone(hotelSelected.phone)) {
      alert('Invalid phone number. Please enter a valid US phone number.');
      return;
    }

    if (!validateEmail(hotelSelected.email)) {
      alert('Invalid Email');
      return;
    }

    const formatSelectedHotelDate = [format(hotelSelected.date[0], 'MM/dd/yyyy'), format(hotelSelected.date[1], 'MM/dd/yyyy')];

    const isExistingBooking = reservation.some((el: any) => {
      if (el.id === hotelSelected.id) return false;

      const formatFoundHotelDate = [format(el.date[0], 'MM/dd/yyyy'), format(el.date[1], 'MM/dd/yyyy')];
      const areDatesEqual = formatSelectedHotelDate.every((date, index) => date === formatFoundHotelDate[index]);

      return el.hotel.HotelName === hotelSelected.hotel.HotelName && areDatesEqual;
    });

    if (isExistingBooking) {
      alert("There is already a reservation for this hotel on the selected dates");
      return;
    }

    const hotelIndex = reservation.findIndex((el: any) => el.id === hotelSelected?.id);

    dispatch(updateReservation({
      index: hotelIndex,
      reservation: {
        ...reservation[hotelIndex],
        name: hotelSelected.name,
        phone: hotelSelected.phone,
        email: hotelSelected.email,
        date: hotelSelected.date,
      }
    }));

    setIsModalOpen(false);
    alert('Reservation updated successfully!');
  };

  const handleSelectHotel = (hotel: ReservationSelected) => {
    setHotelSelected(hotel);
    setIsModalOpen(true);
  }

  const handleDeleteReservation = async () => {
    if (userReservations.length > 0 && hotelSelected?.id) {
      const response = await deleteReservationApi(hotelSelected.id);

      if ('success' in response) {
        const hotelIndex = reservation.findIndex((el: any) => el.id === hotelSelected?.id);
        dispatch(deleteReservation(hotelIndex));
        setIsModalOpen(false);
        setHotelSelected(userReservations[0] || {});
      } else {
        alert(response.error);
      }
    }
  }

  const handleUpdateReservation = async () => {
    if (reservation.length > 0) {
      await validateExistingBooking();
    }
  }

  useEffect(() => {
    setHotelSelected((prevState) => ({ ...prevState, date: searchParams.date }));
  }, [searchParams.date])

  return (
    <Container>
      <Header>
        <Logo src={LogoIcon} alt="LogoIcon" />
        <ProfileContainer>
          <AuthHeader />
        </ProfileContainer>
        <div onClick={() => navigate(-1)} className="back-button-container">
          <img src={ArrowIcon} alt="ArrowIcon" />
        </div>
      </Header>
      <Content>
        <ItemContainer>
          {userReservations.length > 0 ? userReservations.map((item: any, index: number) => (
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
        {userReservations.length > 0 && (
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
                  placeholder="(555) 555-5555"
                  value={hotelSelected?.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
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
                  placeholder="(555) 555-5555"
                  value={hotelSelected?.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
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