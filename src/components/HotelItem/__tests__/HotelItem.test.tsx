import React from 'react';
import configureStore from 'redux-mock-store';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HotelItem from '..';
import { Hotel } from '../../../utils/types/hotelTypes';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../utils/theme';
import { Provider } from 'react-redux';

const mockHotel: Hotel = {
  HotelId: '1',
  HotelName: 'Test Hotel',
  Description: 'This is a test description for the test hotel.',
  ImageSource: 'https://example.com/image.jpg',
  Address: {
    StreetAddress: '123 Test St',
    City: 'Test City',
    StateProvince: 'TS',
    Country: 'USA',
    PostalCode: '000000',
  },
  Category: 'Test Category',
  Location: {
    coordinates: [1, 1],
    type: 'test type'
  },
  Description_fr: 'Description test',
  LastRenovationDate: 'Renovation Test',
  ParkingIncluded: false,
  Rating: 5.0,
  Tags: [],
  Rooms: [
    {
      BaseRate: 100,
    },
  ],
};

const mockStore = configureStore([]);

describe('HotelItem Component', () => {
  let store: any;
  const onClickMock = jest.fn();

  beforeEach(() => {
    store = mockStore({
      user: {
        destination: 'Paris',
        adults: '2 adults',
        children: '1 child',
        date: [new Date('2024-07-14'), new Date('2024-07-17')],
      },
    });
  });

  it('renders hotel item with default style', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <HotelItem
              hotel={mockHotel}
              onClick={onClickMock}
              totalPrice="$300.00"
            />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders hotel name, description, and address', () => {
    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <HotelItem
              hotel={mockHotel}
              onClick={onClickMock}
              totalPrice="$300.00"
            />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(getByText('Test Hotel')).toBeInTheDocument();
    expect(getByText('This is a test description for the test hotel.')).toBeInTheDocument();
    expect(getByText('123 Test St, Test City, TS')).toBeInTheDocument();

    const image = getByAltText('source-image') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe('https://example.com/image.jpg');
  });

  it('renders default image when ImageSource is not provided', () => {
    const { getByAltText } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <HotelItem
              hotel={{ ...mockHotel, ImageSource: '' }}
              onClick={onClickMock}
              totalPrice="$300.00"
            />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const image = getByAltText('source-image') as HTMLImageElement;
    expect(image).toBeInTheDocument();
  });

  it('handles click event', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <HotelItem
              hotel={mockHotel}
              onClick={onClickMock}
              totalPrice="$300.00"
            />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    fireEvent.click(getByText('Test Hotel'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('renders hotel rating and price', () => {
    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <HotelItem
              hotel={mockHotel}
              onClick={onClickMock}
              totalPrice="$300.00"
            />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const starIcon = getByAltText('StarIcon') as HTMLImageElement;
    expect(starIcon).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('$ 100 night')).toBeInTheDocument();
    expect(getByText('$300.00 total')).toBeInTheDocument();
  });
});
