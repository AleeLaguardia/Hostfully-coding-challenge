import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CalendarComponent from '..';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../utils/theme';

const mockStore = configureStore([]);

describe('CalendarComponent', () => {
  let store: any;
  let setIsOpen: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      user: {
        destination: 'Paris',
        adults: '2 adults',
        children: '1 child',
        date: [new Date('2024-07-14'), new Date('2024-07-17')],
      },
    });
    setIsOpen = jest.fn();
    store.dispatch = jest.fn();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </Provider>
    )
  }

  it('renders CalendarComponent with default styling', () => {
    const { asFragment } = renderWithProviders(<CalendarComponent isOpen={true} setIsOpen={setIsOpen} />);

    expect(asFragment).toMatchSnapshot();
  });

  it('renders CalendarComponent correctly', () => {
    const { getByText } = renderWithProviders(<CalendarComponent isOpen={true} setIsOpen={setIsOpen} />);

    expect(getByText('July 2024')).toBeInTheDocument();
  });

  it('handles date change correctly', () => {
    const { getByText } = renderWithProviders(<CalendarComponent isOpen={true} setIsOpen={setIsOpen} />);

    fireEvent.click(getByText('15'));
    fireEvent.click(getByText('17'));
  });
});
