import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputCollection from "..";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { theme } from "../../../utils/theme";
import store from "../../../store";

const mockProps = {
  destination: "Paris",
  startDate: "01/01/2022",
  endDate: "01/10/2022",
  people: "2 adults",
  onDestinationChange: jest.fn(),
  confirmChanges: jest.fn(),
  isCalendarOpen: false,
  setIsCalendarOpen: jest.fn(),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("InputCollection Component", () => {
  it("renders with default styling", () => {
    const { asFragment } = renderWithProviders(<InputCollection {...mockProps} />)

    expect(asFragment).toMatchSnapshot();
  })

  it("renders correctly with given props", () => {
    renderWithProviders(<InputCollection {...mockProps} />);
    
    
    expect(screen.getByPlaceholderText("Destination...")).toHaveValue("Paris");
    
    
    expect(screen.getByText("01/01/2022 - 01/10/2022")).toBeInTheDocument();
    
    
    expect(screen.getByText("2 adults")).toBeInTheDocument();
  });

  it("calls onDestinationChange when destination input changes", () => {
    renderWithProviders(<InputCollection {...mockProps} />);
    
    const destinationInput = screen.getByPlaceholderText("Destination...");
    fireEvent.change(destinationInput, { target: { value: "New York" } });
    
    expect(mockProps.onDestinationChange).toHaveBeenCalled();
  });

  it("toggles calendar visibility when date input container is clicked", () => {
    renderWithProviders(<InputCollection {...mockProps} />);
    
    const dateInputContainer = screen.getByTestId("date-input-container");
    fireEvent.click(dateInputContainer);
    
    expect(mockProps.setIsCalendarOpen).toHaveBeenCalledWith(true);
  });

  it("displays the calendar when isCalendarOpen is true", () => {
    renderWithProviders(<InputCollection {...mockProps} isCalendarOpen={true} />);
    
    expect(screen.getByTestId("calendar-component")).toBeInTheDocument();
  });

  it("closes the calendar when clicking outside of it", () => {
    renderWithProviders(<InputCollection {...mockProps} isCalendarOpen={true} />);
    
    
    const dateInputContainer = screen.getByTestId("date-input-container");
    fireEvent.mouseDown(dateInputContainer);
    expect(mockProps.setIsCalendarOpen).not.toHaveBeenCalledWith(false);

    
    fireEvent.mouseDown(document);
    expect(mockProps.setIsCalendarOpen).toHaveBeenCalledWith(false);
  });
});
