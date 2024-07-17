import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.galery};
  border-radius: 40px;

  .react-calendar {
    display: flex;
    flex-direction: column;
    height: fit-content;
    border-style: none;
    width: 400px;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
    padding: 30px 30px;
    align-items: center;
    border-radius: 40px;

    .react-calendar__navigation__label {
      font-family: ${(props) => props.theme.fonts.poppins};
      color: ${(props) => props.theme.colors.emperor};
      font-weight: 400;
      text-transform: uppercase;
      border: none;
      margin: 0 10px 20px 10px;
      cursor: pointer;

      &:hover {
        background-color: ${(props) => props.theme.colors.galery};
      }
    }

    .react-calendar__navigation__arrow {
      border: none;
      background-color: transparent;
      width: 30px;
      cursor: pointer;
    }

    .react-calendar__month-view__weekdays {
      text-align: center;
    }

    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none;
      font-size: ${(props) => props.theme.sizes.xs};
      color: ${(props) => props.theme.colors.emperor};
      font-family: ${(props) => props.theme.fonts.poppins};
      font-weight: 500;
    }

    .react-calendar__month-view__days abbr {
      text-decoration: none;
      font-size: ${(props) => props.theme.sizes.xs};
      color: ${(props) => props.theme.colors.emperor};
      font-family: ${(props) => props.theme.fonts.poppins};
      font-weight: 500;
    }

    .react-calendar__tile {
      height: 40px;
      width: 15px;
      cursor: pointer;
      border: none;
    }

    .react-calendar__tile--hover {
      background-color: #e6e6e6 !important;
    }

    .react-calendar__tile--hoverEnd {
      border-top-right-radius: 40px;
      border-bottom-right-radius: 40px;
    }

    .react-calendar__tile--hoverStart {
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
    }

    .react-calendar__tile--active,
    .react-calendar__tile--hasActive {
      background-color: ${(props) => props.theme.colors.lightPurple} !important;
    }

    .react-calendar__tile--active abbr,
    .react-calendar__tile--hasActive abbr {
      color: white;
    }

    .react-calendar__tile--hasActive {
      border-radius: 40px;
    }

    .react-calendar__tile--now {
      background-color: purple;

      abbr {
        color: white;
      }
    }

    .react-calendar__tile--now--active {
      background-color: red;
    }

    .react-calendar__tile--rangeBothEnds {
      border-radius: 40px;
    }

    .react-calendar__tile--rangeEnd {
      border-top-right-radius: 40px;
      border-bottom-right-radius: 40px;
      background-color: ${(props) => props.theme.colors.lightPurple};

      abbr {
        color: white;
      }
    }

    .react-calendar__tile--rangeStart {
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
      background-color: ${(props) => props.theme.colors.lightPurple};

      abbr {
        color: white;
      }
    }

    .react-calendar__tile:disabled {
      background-color: transparent;

      abbr {
        color: ${(props) => props.theme.colors.silverChalice};
      }
    }

    .react-calendar__navigation button:disabled {
      background-color: transparent;
      color: ${(props) => props.theme.colors.silverChalice};
    }
  }
`;