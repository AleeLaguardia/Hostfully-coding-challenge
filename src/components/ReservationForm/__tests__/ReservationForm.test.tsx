import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import ReservationForm from '..';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../utils/theme';
import { BrowserRouter } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

const mockStore = configureStore([]);

describe('ReservationForm', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      user: {
        destination: '',
        adults: '',
        children: '',
        date: [new Date('2024-07-14'), new Date('2024-07-17')],
      },
    });
  });

  it('renders ReservationForm correctly', () => {
    const { getByText, getByPlaceholderText, asFragment } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <ReservationForm />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(getByPlaceholderText('Destination...')).toBeInTheDocument();
    expect(getByText('How many adults')).toBeInTheDocument();
    expect(getByText('How many children')).toBeInTheDocument();
    expect(getByText('Confirm')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('handles input change correctly', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <ReservationForm />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );
    
    fireEvent.click(getByTestId('first-date-calendar-dataid'));

    fireEvent.click(getByText('16'));
    fireEvent.click(getByText('18'));

    fireEvent.click(getByText('Confirm'));

    expect(getByPlaceholderText('Destination...')).toHaveStyle('border: 1px solid #FA1E71');

    fireEvent.change(getByPlaceholderText('Destination...'), { target: { value: 'Paris' } });

    expect(getByPlaceholderText('Destination...')).toHaveValue('Paris');
  });

  it('handles confirmation correctly', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <ReservationForm />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText('Destination...'), { target: { value: 'Paris' } });
    fireEvent.click(getByTestId('first-date-calendar-dataid'));
    fireEvent.click(getByText('14'));
    fireEvent.click(getByTestId('second-date-calendar-dataid'));
    fireEvent.click(getByText('17'));

    fireEvent.click(getByTestId('adult-dropdown'));
    fireEvent.click(getByText('2 adults'));

    fireEvent.click(getByTestId('children-dropdown'));
    fireEvent.click(getByText('1 child'));

    fireEvent.click(getByText('Confirm'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual([
        {
          type: 'user/setUser',
          payload: {
            destination: 'Paris',
            date: [new Date('2024-07-14T00:00:00.000Z'), new Date('2024-07-17T00:00:00.000Z')],
            adults: '2 adults',
            children: '1 child',
          },
        },
      ]);
    });
  });

  it('handles dropdown selections correctly', () => {
    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <ReservationForm />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('adult-dropdown'));
    fireEvent.click(getByText('2 adults'));

    expect(getByTestId('adult-dropdown')).toHaveTextContent('2 adults');

    fireEvent.click(getByTestId('children-dropdown'));
    fireEvent.click(getByText('1 child'));

    expect(getByTestId('children-dropdown')).toHaveTextContent('1 child');
  });
});
