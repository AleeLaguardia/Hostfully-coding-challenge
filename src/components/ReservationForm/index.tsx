import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/slice/userInfoSlice";
import LogoIcon from '../../assets/purple-logo-1.png'
import Button from "../Button";
import Dropdown from "../Dropdown";
import { ButtonContainer, CalendarContainer, Container, Content, DateInput, DateInputContainer, InputContainer, Logo } from "./style";
import { HOME, PATH } from "../../utils/strings";
import CalendarComponent from "../CalendarComponent";
import { RootState } from "../../store";
import { differenceInDays, format, setDate } from "date-fns";
import useClickOutside from "../../utils/hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import Input from "../Input";
import { theme } from "../../utils/theme";

const optionsAdults = ['1 adult', '2 adults', '3 adults', '4 adults', '5 adults', 'More than 5'];
const optionsChildren = ['No children', '1 child', '2 children', '3 children', '4 children', '5 children', 'More than 5'];

const ReservationForm: React.FC = () => {
  const [destination, setDestination] = useState<string>('');
  const [adults, setAdults] = useState<string>('');
  const [children, setChildren] = useState<string>('');

  const [isDropdownAdultOpen, setIsDropdownAdultOpen] = useState<boolean>(false);
  const [isDropdownChildrenOpen, setIsDropdownChildrenOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const [destinationError, setDestinationError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [adultsError, setAdultsError] = useState<boolean>(false);
  const [childrenError, setChildrenError] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { date } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();

  const calendarRef = useClickOutside(() => setIsCalendarOpen(false));
  const adultDropdownRef = useClickOutside(() => setIsDropdownAdultOpen(false));
  const childrenDropdownRef = useClickOutside(() => setIsDropdownChildrenOpen(false));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    e.preventDefault();
    setState(e.target.value);
  };

  const handleConfirm = () => {
    if (destination === '') {
      setDestinationError(true);
    } else {
      setDestinationError(false);
    }

    if (adults === '') {
      setAdultsError(true);
    } else {
      setAdultsError(false);
    }

    if (children === '') {
      setChildrenError(true)
    } else {
      setChildrenError(false)
    }

    if (differenceInDays(date[1], date[0]) < 1) {
      setDateError(true);
    } else {
      setDateError(false);
    }

    if (destination.length !== 0 && adults.length !== 0 && children.length !== 0 && differenceInDays(date[1], date[0]) > 0) {
      dispatch(setUser({ destination, date, adults, children }));
      navigate(`${PATH.BOOKING}?destination=${destination}&checkin=${format(date[0], 'MM/dd/yyyy')}&checkout=${format(date[1], 'MM/dd/yyyy')}&adults=${adults}&children=${children}`);
    }
  }

  return (
    <Container>
      <Content>
        <Logo draggable={false} src={LogoIcon} alt="LogoIcon" />
        <InputContainer>
          <span className="title">{HOME.TITLE_FORM}</span>
          <Input
            placeholder="Destination..."
            value={destination}
            onChange={(e) => handleInputChange(e, setDestination)}
            error={destinationError}
          />
          <DateInputContainer ref={calendarRef}>
            <DateInput data-testid="first-date-calendar-dataid" onClick={() => setIsCalendarOpen(true)} error={dateError}>
              <span>{format(date[0], 'MM/dd/yyyy')}</span>
            </DateInput>
            <DateInput data-testid="second-date-calendar-dataid" onClick={() => setIsCalendarOpen(true)} error={dateError}>
              <span>{format(date[1], 'MM/dd/yyyy')}</span>
            </DateInput>
            {isCalendarOpen && (
              <CalendarContainer>
                <CalendarComponent isOpen={isCalendarOpen} setIsOpen={setIsCalendarOpen} />
              </CalendarContainer>
            )}
          </DateInputContainer>
          <DateInputContainer ref={isDropdownAdultOpen ? adultDropdownRef : childrenDropdownRef}>
            <Dropdown
              error={adultsError}
              data-testid="adult-dropdown"
              placeholder={HOME.ADULTS}
              isDropdownOpen={isDropdownAdultOpen}
              setIsDropdownOpen={setIsDropdownAdultOpen}
              setOptionSelected={setAdults}
              optionSelected={adults}
              options={optionsAdults}
            />
            <Dropdown
              error={childrenError}
              data-testid="children-dropdown"
              placeholder={HOME.CHILDREN}
              isDropdownOpen={isDropdownChildrenOpen}
              setIsDropdownOpen={setIsDropdownChildrenOpen}
              setOptionSelected={setChildren}
              optionSelected={children}
              options={optionsChildren}
            />
          </DateInputContainer>
        </InputContainer>
        <ButtonContainer>
          <Button
            onClick={handleConfirm}
            label="Confirm"
          />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default ReservationForm;
