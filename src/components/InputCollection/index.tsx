import React from "react";
import {
  Container,
  DestinationInputContainer,
  PeopleInputContainer,
  DateInputContainer,
  ButtonContainer,
  Button,
  DisplayElement,
  CalendarContainer,
} from "./style";
import Input from "../Input";
import CalendarComponent from "../CalendarComponent";
import useClickOutside from "../../utils/hooks/useClickOutside";
import Dropdown from "../Dropdown";

interface Props {
  destination: string;
  startDate: string;
  endDate: string;
  people: string;
  onDestinationChange: React.ChangeEventHandler<HTMLInputElement>;
  confirmChanges: () => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputCollection: React.FC<Props> = ({
  isCalendarOpen,
  setIsCalendarOpen,
  destination,
  startDate,
  endDate,
  people,
  onDestinationChange,
  confirmChanges,
}) => {
  const calendarRef = useClickOutside(() => setIsCalendarOpen(false));

  return (
    <Container>
      <DestinationInputContainer>
        <Input
          error={false}
          placeholder="Destination..."
          onChange={onDestinationChange}
          value={destination}
        />
      </DestinationInputContainer>
      <DateInputContainer
        ref={calendarRef}
        onClick={() => setIsCalendarOpen(true)}
        data-testid="date-input-container"
      >
        <DisplayElement>
          <span>{`${startDate} - ${endDate}`}</span>
        </DisplayElement>
        {isCalendarOpen && (
          <CalendarContainer>
            <CalendarComponent isOpen={isCalendarOpen} setIsOpen={setIsCalendarOpen} />
          </CalendarContainer>
        )}
      </DateInputContainer>
      <PeopleInputContainer>
        <DisplayElement>
          <span>{people.toLowerCase()}</span>
        </DisplayElement>
      </PeopleInputContainer>
    </Container>
  );
};

export default InputCollection;
