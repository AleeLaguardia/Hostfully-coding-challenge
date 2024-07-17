import React, { useState } from "react";
import { Container, ImageContainer, MapContainer, InfoContainer, BookingContainer, UserInfoContainer, BookingTitle, ButtonContainer } from "./style";
import { Hotel } from "../../utils/types/hotelTypes";
import MapComponent from "../MapComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { format } from "date-fns";
import Input from "../Input";
import Dropdown from "../Dropdown";
import { theme } from "../../utils/theme";
import Button from "../Button";
import { addReservation } from "../../store/slice/reservationSlice";

interface Props {
  hotel: Hotel;
  ref: React.RefObject<HTMLDivElement> | null;
  totalPrice: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const options = ['Credit Card', 'Debit Card', 'Money', 'Gift Card'];

const ItemModal: React.FC<Props> = ({ hotel, ref, totalPrice, isModalOpen, setIsModalOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [option, setOption] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [nameError, setNameError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

  const dispatch = useDispatch();
  const reservation = useSelector((state: RootState) => state.reservation);

  const { date } = useSelector((state: RootState) => state.user);

  const { StreetAddress, City, StateProvince } = hotel.Address;

  const handleConfirm = () => {
    validateExistingBooking();
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);

    if (isValid) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }

    return isValid;
  };

  const validateExistingBooking = () => {
    const dispatchReservation = () => {
      if (name.length > 0 && phone.length > 0 && email.length > 0) {
        const isEmailValid = validateEmail(email);

        if (isEmailValid) {
          dispatch(addReservation({
            name,
            phone,
            email,
            paymentMethod: option.length > 0 ? option : options[0],
            date,
            hotel,
          }));

          setIsModalOpen(false);
        }
      } else {
        if (name.length === 0) {
          setNameError(true);
        } else {
          setNameError(false);
        }

        if (phone.length === 0) {
          setPhoneError(true);
        } else {
          setPhoneError(false);
        }

        if (email.length === 0) {
          setEmailError(true);
        } else {
          setEmailError(false);
        }
      }
    };

    const formatSelectedHotelDate = [format(date[0], 'MM/dd/yyyy'), format(date[1], 'MM/dd/yyyy')];

    const isExistingBooking = reservation.some((el) => {
      const formatFoundHotelDate = [format(el.date[0], 'MM/dd/yyyy'), format(el.date[1], 'MM/dd/yyyy')];
      const areDatesEqual = formatSelectedHotelDate.every((date, index) => date === formatFoundHotelDate[index]);

      return el.hotel.HotelName === hotel.HotelName && areDatesEqual;
    });

    if (isExistingBooking) {
      alert("There is already a reservation with the same date");
    } else {
      dispatchReservation();
    }
  };

  return (
    <Container onClick={(e) => e.stopPropagation()} ref={ref}>
      <ImageContainer>
        <img src={hotel.ImageSource} alt="ImageSource" />
      </ImageContainer>
      <InfoContainer>
        <span className="title">{hotel.HotelName}</span>
        <span className="address">{StreetAddress}, {City}, {StateProvince}</span>
        <span className="description">{hotel.Description}</span>
        <div className="price-container">
          <span>Checkin: {format(date[0], 'MM/dd/yyyy')}</span>
          <span>Checkout: {format(date[1], 'MM/dd/yyyy')}</span>
          <span>Price: {totalPrice}</span>
        </div>
      </InfoContainer>
      <MapContainer>
        <MapComponent position={hotel.Location.coordinates} />
      </MapContainer>
      <BookingContainer>
        <BookingTitle>
          <span>Confirm your reservation</span>
        </BookingTitle>
        <div className="input-container">
          <UserInfoContainer>
            <div className="dropdown-container">
              <Dropdown
                error={false}
                data-testid="adult-dropdown"
                placeholder="Payment Method"
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                setOptionSelected={setOption}
                optionSelected={option}
                options={options}
                width="100%"
              />
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              error={nameError}
            />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              error={phoneError}
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              error={emailError}
            />
            <ButtonContainer>
              <Button
                color={theme.colors.white}
                colorHover={theme.colors.galery}
                labelColor={theme.colors.selectiveYellow}
                onClick={() => setIsModalOpen(false)}
                label="Cancel"
                width="100%"
                borderColor={theme.colors.selectiveYellow}
              />
              <Button
                color={theme.colors.selectiveYellow}
                colorHover={theme.colors.chelseaGem}
                onClick={handleConfirm}
                label="Confirm"
                width="100%"
              />
            </ButtonContainer>
          </UserInfoContainer>
        </div>
      </BookingContainer>
    </Container>
  );
};

export default ItemModal;
