import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import { Container } from "./style";
import { setUser } from "../../store/slice/userInfoSlice";
import { RootState } from "../../store";
import { Value } from "react-calendar/dist/cjs/shared/types";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalendarComponent: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleDateChange = (date: Value) => {
    if (isOpen) {
      console.log("Date selected:", date); // Log the selected date
      setIsOpen(false);
      dispatch(setUser({ ...user, date }));
    }
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Container data-testid="calendar-component">
      <Calendar
        tileClassName="tile-container"
        selectRange
        locale="en-GB"
        className="calendar-container"
        returnValue="range"
        showNeighboringMonth={false}
        onChange={(date: Value) => handleDateChange(date)}
        value={user.date[0] || user.date[1] ? user.date : [new Date(), new Date()]}
        tileDisabled={tileDisabled}
        prev2Label={false}
        next2Label={false}
        view="month"
      />
    </Container>
  );
};

export default CalendarComponent;
