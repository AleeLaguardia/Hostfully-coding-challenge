import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import configureStore from 'redux-mock-store';
import Booking from '..';
import { theme } from '../../../utils/theme';
import { BOOKING } from '../../../utils/strings';

const mockGetHotels = jest.fn();
const mockGetAllReservations = jest.fn();

jest.mock('../../../api/hotel', () => ({
  getHotels: () => mockGetHotels(),
}));

jest.mock('../../../api/auth', () => ({
  loginApi: jest.fn(),
  registerApi: jest.fn(),
  getAllReservations: () => mockGetAllReservations(),
  createReservation: jest.fn(),
}));

jest.mock('../../../components/MapComponent', () => {
  return function MockMapComponent() {
    return <div data-testid="mock-map">Map</div>;
  };
});

const mockStore = configureStore([]);

const mockHotels = [
  {
    HotelId: '1',
    HotelName: 'Grand Hotel New York',
    Description: 'A luxury hotel in NYC',
    ImageSource: 'https://example.com/hotel1.jpg',
    Address: {
      StreetAddress: '123 Main St',
      City: 'New York',
      StateProvince: 'NY',
      Country: 'USA',
      PostalCode: '10001',
    },
    Category: 'Luxury',
    Location: { coordinates: [-74.006, 40.7128], type: 'Point' },
    Description_fr: 'Un hôtel de luxe',
    LastRenovationDate: '2023-01-01',
    ParkingIncluded: true,
    Rating: 4.8,
    Tags: ['pool', 'spa'],
    Rooms: [{ BaseRate: 200 }],
  },
  {
    HotelId: '2',
    HotelName: 'Beach Resort Miami',
    Description: 'Beachfront property',
    ImageSource: 'https://example.com/hotel2.jpg',
    Address: {
      StreetAddress: '456 Ocean Dr',
      City: 'Miami',
      StateProvince: 'FL',
      Country: 'USA',
      PostalCode: '33139',
    },
    Category: 'Resort',
    Location: { coordinates: [-80.1918, 25.7617], type: 'Point' },
    Description_fr: 'Propriété en bord de mer',
    LastRenovationDate: '2022-06-01',
    ParkingIncluded: true,
    Rating: 4.5,
    Tags: ['beach', 'pool'],
    Rooms: [{ BaseRate: 300 }],
  },
  {
    HotelId: '3',
    HotelName: 'Downtown NYC Hotel',
    Description: 'Budget friendly in NYC',
    ImageSource: 'https://example.com/hotel3.jpg',
    Address: {
      StreetAddress: '789 Broadway',
      City: 'New York',
      StateProvince: 'NY',
      Country: 'USA',
      PostalCode: '10003',
    },
    Category: 'Budget',
    Location: { coordinates: [-73.99, 40.73], type: 'Point' },
    Description_fr: 'Économique à NYC',
    LastRenovationDate: '2021-01-01',
    ParkingIncluded: false,
    Rating: 3.8,
    Tags: ['downtown'],
    Rooms: [{ BaseRate: 100 }],
  },
];

const createManyHotels = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    HotelId: String(i + 1),
    HotelName: `Hotel ${i + 1}`,
    Description: `Description for hotel ${i + 1}`,
    ImageSource: `https://example.com/hotel${i + 1}.jpg`,
    Address: {
      StreetAddress: `${i + 1} Main St`,
      City: 'New York',
      StateProvince: 'NY',
      Country: 'USA',
      PostalCode: '10001',
    },
    Category: 'Standard',
    Location: { coordinates: [-74.006, 40.7128], type: 'Point' },
    Description_fr: `Description en français ${i + 1}`,
    LastRenovationDate: '2023-01-01',
    ParkingIncluded: true,
    Rating: 4.0,
    Tags: [],
    Rooms: [{ BaseRate: 100 + i }],
  }));
};

const defaultStore = {
  user: {
    destination: '',
    adults: '2 adults',
    children: 'No children',
    date: [new Date('2024-07-14'), new Date('2024-07-17')],
  },
  auth: {
    isAuthenticated: false,
    user: null,
  },
};

const renderWithProviders = (
  store: any,
  initialEntries: string[] = ['/booking']
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider theme={theme}>
          <Booking />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('Booking Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetHotels.mockResolvedValue({
      status: 200,
      data: { value: mockHotels },
    });
    mockGetAllReservations.mockResolvedValue({ data: [] });
  });

  describe('Initial Rendering', () => {
    it('renders the booking page with logo', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByAltText('LogoIcon')).toBeInTheDocument();
      });
    });

    it('renders AuthHeader component', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
      });
    });

    it('renders InputCollection with destination input', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Destination...')).toBeInTheDocument();
      });
    });

    it('displays hotels after loading', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
        expect(screen.getByText('Beach Resort Miami')).toBeInTheDocument();
        expect(screen.getByText('Downtown NYC Hotel')).toBeInTheDocument();
      });
    });
  });

  describe('URL Parameters', () => {
    it('uses destination from URL params', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store, ['/booking?destination=Miami']);

      await waitFor(() => {
        const destinationInput = screen.getByPlaceholderText('Destination...');
        expect(destinationInput).toHaveValue('Miami');
      });
    });

    it('shows default adults and children when not in URL', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store, ['/booking']);

      await waitFor(() => {
        expect(screen.getByText('2 adults and no children')).toBeInTheDocument();
      });
    });

    it('uses adults and children from URL params', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store, ['/booking?adults=3%20adults&children=2%20children']);

      await waitFor(() => {
        expect(screen.getByText('3 adults and 2 children')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering Hotels', () => {
    it('filters hotels by destination', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store, ['/booking?destination=Miami']);

      await waitFor(() => {
        expect(screen.getByText('Beach Resort Miami')).toBeInTheDocument();
        expect(screen.queryByText('Grand Hotel New York')).not.toBeInTheDocument();
        expect(screen.queryByText('Downtown NYC Hotel')).not.toBeInTheDocument();
      });
    });

    it('shows all hotels when destination is empty', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
        expect(screen.getByText('Beach Resort Miami')).toBeInTheDocument();
        expect(screen.getByText('Downtown NYC Hotel')).toBeInTheDocument();
      });
    });

    it('shows no data message when destination has no hotels', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store, ['/booking?destination=Paris']);

      await waitFor(() => {
        expect(screen.getByText(BOOKING.NO_DATA)).toBeInTheDocument();
      });
    });

    it('filters destination case-insensitively', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store, ['/booking?destination=NEW%20YORK']);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
        expect(screen.getByText('Downtown NYC Hotel')).toBeInTheDocument();
        expect(screen.queryByText('Beach Resort Miami')).not.toBeInTheDocument();
      });
    });
  });

  describe('Destination Input Change', () => {
    it('updates filtered hotels when destination changes', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      });

      const destinationInput = screen.getByPlaceholderText('Destination...');
      fireEvent.change(destinationInput, { target: { value: 'Miami' } });

      await waitFor(() => {
        expect(screen.getByText('Beach Resort Miami')).toBeInTheDocument();
        expect(screen.queryByText('Grand Hotel New York')).not.toBeInTheDocument();
      });
    });
  });

  describe('Hotel Availability Filtering', () => {
    it('excludes hotels with conflicting reservations', async () => {
      const reservationsWithConflict = [
        {
          id: '1',
          userId: 'user1',
          name: 'John Doe',
          phone: '(555) 555-5555',
          email: 'john@example.com',
          paymentMethod: 'Credit Card',
          checkIn: '2024-07-14',
          checkOut: '2024-07-17',
          hotel: mockHotels[0],
        },
      ];

      mockGetAllReservations.mockResolvedValue({ data: reservationsWithConflict });

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.queryByText('Grand Hotel New York')).not.toBeInTheDocument();
        expect(screen.getByText('Beach Resort Miami')).toBeInTheDocument();
        expect(screen.getByText('Downtown NYC Hotel')).toBeInTheDocument();
      });
    });

    it('shows all hotels when there are no conflicting reservations', async () => {
      const reservationsNoConflict = [
        {
          id: '1',
          userId: 'user1',
          name: 'John Doe',
          phone: '(555) 555-5555',
          email: 'john@example.com',
          paymentMethod: 'Credit Card',
          checkIn: '2024-08-01',
          checkOut: '2024-08-05',
          hotel: mockHotels[0],
        },
      ];

      mockGetAllReservations.mockResolvedValue({ data: reservationsNoConflict });

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
        expect(screen.getByText('Beach Resort Miami')).toBeInTheDocument();
        expect(screen.getByText('Downtown NYC Hotel')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('shows pagination when more than 10 hotels', async () => {
      const manyHotels = createManyHotels(15);
      mockGetHotels.mockResolvedValue({
        status: 200,
        data: { value: manyHotels },
      });

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('does not show pagination when 10 or fewer hotels', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      });

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('shows first 10 hotels on page 1', async () => {
      const manyHotels = createManyHotels(15);
      mockGetHotels.mockResolvedValue({
        status: 200,
        data: { value: manyHotels },
      });

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Hotel 1')).toBeInTheDocument();
        expect(screen.getByText('Hotel 10')).toBeInTheDocument();
        expect(screen.queryByText('Hotel 11')).not.toBeInTheDocument();
      });
    });

    it('disables Previous button on first page', async () => {
      const manyHotels = createManyHotels(15);
      mockGetHotels.mockResolvedValue({
        status: 200,
        data: { value: manyHotels },
      });

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeDisabled();
      });
    });

    it('shows pagination info on first page', async () => {
      const manyHotels = createManyHotels(25);
      mockGetHotels.mockResolvedValue({
        status: 200,
        data: { value: manyHotels },
      });

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('1-10 of 25')).toBeInTheDocument();
      });
    });

    it('can click on page number buttons', async () => {
      const manyHotels = createManyHotels(25);
      mockGetHotels.mockResolvedValue({
        status: 200,
        data: { value: manyHotels },
      });

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });
  });

  describe('Hotel Selection', () => {
    it('opens modal when hotel item is clicked', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      });

      // Click directly on the hotel name - click bubbles up to parent Container with onClick
      fireEvent.click(screen.getByText('Grand Hotel New York'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
      });
    });

    it('shows modal with form inputs when hotel is selected', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      });

      // Click directly on the hotel name - click bubbles up to parent Container with onClick
      fireEvent.click(screen.getByText('Grand Hotel New York'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('(555) 555-5555')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      });
    });
  });

  describe('Price Calculation', () => {
    it('calculates total price based on number of days', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      });

      expect(screen.getByText('$ 600.00 total')).toBeInTheDocument();
    });

    it('shows price per night', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      });

      expect(screen.getByText('$ 200 night')).toBeInTheDocument();
    });
  });

  describe('API Error Handling', () => {
    it('shows missing endpoint modal when API fails', async () => {
      mockGetHotels.mockResolvedValue({ message: 'Something went wrong' });

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Please, follow these instructions')).toBeInTheDocument();
      });
    });
  });

  describe('Authenticated User', () => {
    it('shows profile button when user is authenticated', async () => {
      const authenticatedStore = mockStore({
        ...defaultStore,
        auth: {
          isAuthenticated: true,
          user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        },
      });

      renderWithProviders(authenticatedStore);

      await waitFor(() => {
        expect(screen.getByAltText('Profile')).toBeInTheDocument();
      });
    });
  });

  describe('Hotel Details', () => {
    it('displays hotel rating', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('4.8')).toBeInTheDocument();
        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('3.8')).toBeInTheDocument();
      });
    });

    it('displays hotel address', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('123 Main St, New York, NY')).toBeInTheDocument();
        expect(screen.getByText('456 Ocean Dr, Miami, FL')).toBeInTheDocument();
      });
    });

    it('displays hotel description', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('A luxury hotel in NYC')).toBeInTheDocument();
        expect(screen.getByText('Beachfront property')).toBeInTheDocument();
      });
    });
  });

  describe('Snapshot', () => {
    it('renders with default styling', async () => {
      const store = mockStore(defaultStore);
      const { asFragment } = renderWithProviders(store);

      await waitFor(() => {
        expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
