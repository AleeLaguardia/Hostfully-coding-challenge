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
import { createReservation } from "../../api/auth";

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
  const { user } = useSelector((state: RootState) => state.auth);

  const { date } = useSelector((state: RootState) => state.user);

  const { StreetAddress, City, StateProvince } = hotel.Address;

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateName = (name: string): boolean => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name) && name.trim().length >= 2;
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleConfirm = async () => {
    let hasError = false;

    if (!validateName(name)) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!validatePhone(phone)) {
      setPhoneError(true);
      hasError = true;
    } else {
      setPhoneError(false);
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (hasError || !user) {
      return;
    }

    const reservationData = {
      userId: user.id,
      name,
      phone,
      email,
      paymentMethod: option.length > 0 ? option : options[0],
      checkIn: format(date[0], 'yyyy-MM-dd'),
      checkOut: format(date[1], 'yyyy-MM-dd'),
      hotel,
    };

    const response = await createReservation(reservationData);

    if ('data' in response) {
      dispatch(addReservation({
        ...reservationData,
        id: response.data.id,
        date,
      }));

      setIsModalOpen(false);
    } else {
      alert(response.error);
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
              onChange={handlePhoneChange}
              placeholder="(555) 555-5555"
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
