import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ItemModal from '..';
import { Hotel } from '../../../utils/types/hotelTypes';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../utils/theme';
import { Provider } from 'react-redux';
import store from '../../../store';
import * as reservationSlice from '../../../store/slice/reservationSlice';

jest.mock('../../MapComponent', () => {
  const MockMapComponent: React.FC<{ position: [number, number] }> = ({ position }) => (
    <div data-testid="mock-map-component">
      {/* Simulação de conteúdo do MapComponent */}
      <span>Mocked Map</span>
      <span>Latitude: {position[0]}</span>
      <span>Longitude: {position[1]}</span>
    </div>
  );
  return MockMapComponent;
});

describe('ItemModal Component', () => {
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

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            {ui}
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    )
  }

  it('renders with default styling', () => {
    const { asFragment } = renderWithProviders(
      <ItemModal
        hotel={mockHotel}
        ref={null}
        totalPrice="$200"
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
      />
    );

    expect(asFragment).toMatchSnapshot();
  })

  it('handles confirmation with valid input', async () => {
    const mockDispatch = jest.fn();
    const mockAddReservation = jest.spyOn(reservationSlice, 'addReservation');

    jest.mock('react-redux', () => ({
      ...jest.requireActual('react-redux'),
      useDispatch: () => mockDispatch,
      useSelector: () => ({
        reservation: [],
        user: { date: [new Date(), new Date()] },
      }),
    }));

    renderWithProviders(
      <ItemModal
        hotel={mockHotel}
        ref={null}
        totalPrice="$200"
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Phone number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });

    expect(screen.getByPlaceholderText('Full name')).toHaveValue('John Doe');
    expect(screen.getByPlaceholderText('Phone number')).toHaveValue('1234567890');
    expect(screen.getByPlaceholderText('Email')).toHaveValue('john.doe@example.com');
  });
});
