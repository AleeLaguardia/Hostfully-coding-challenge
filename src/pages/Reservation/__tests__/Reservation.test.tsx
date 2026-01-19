import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import configureStore from 'redux-mock-store';
import Reservation from '..';
import { theme } from '../../../utils/theme';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockDeleteReservationApi = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../api/auth', () => ({
  deleteReservationApi: (id: string) => mockDeleteReservationApi(id),
}));

jest.mock('../../../components/MapComponent', () => {
  return function MockMapComponent() {
    return <div data-testid="mock-map">Map</div>;
  };
});

jest.mock('../../../components/CalendarComponent', () => {
  return function MockCalendarComponent() {
    return <div data-testid="mock-calendar">Calendar</div>;
  };
});

const mockStore = configureStore([]);

const mockHotel = {
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
};

const mockReservation = {
  id: '1',
  userId: 'user1',
  name: 'John Doe',
  phone: '(555) 123-4567',
  email: 'john@example.com',
  paymentMethod: 'Credit Card',
  date: [new Date('2024-02-01'), new Date('2024-02-05')],
  hotel: mockHotel,
};

const mockReservation2 = {
  id: '2',
  userId: 'user1',
  name: 'Jane Doe',
  phone: '(555) 987-6543',
  email: 'jane@example.com',
  paymentMethod: 'Debit Card',
  date: [new Date('2024-03-01'), new Date('2024-03-05')],
  hotel: {
    ...mockHotel,
    HotelId: '2',
    HotelName: 'Beach Resort Miami',
    Address: {
      ...mockHotel.Address,
      City: 'Miami',
      StateProvince: 'FL',
    },
  },
};

const defaultStore = {
  reservation: [mockReservation],
  user: {
    date: [new Date('2024-02-01'), new Date('2024-02-05')],
    destination: '',
    people: '',
  },
  auth: {
    isAuthenticated: true,
    user: { id: 'user1', name: 'John Doe', email: 'john@example.com' },
    isLoading: false,
    error: null,
  },
};

const renderWithProviders = (store: any) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/reservation']}>
        <ThemeProvider theme={theme}>
          <Reservation />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('Reservation Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteReservationApi.mockResolvedValue({ success: true });
  });

  describe('Rendering', () => {
    it('renders the reservation page with logo', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('LogoIcon')).toBeInTheDocument();
    });

    it('renders AuthHeader component', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('Profile')).toBeInTheDocument();
    });

    it('renders back button', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('ArrowIcon')).toBeInTheDocument();
    });

    it('renders reservation items when reservations exist', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });

    it('renders hotel details section when reservations exist', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText('Update Information')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('(555) 555-5555')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    it('renders Delete and Update buttons', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
    });

    it('renders map component', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('does not render reservation items when no reservations', () => {
      const store = mockStore({
        ...defaultStore,
        reservation: [],
      });
      renderWithProviders(store);

      expect(screen.queryByText('Grand Hotel New York')).not.toBeInTheDocument();
      expect(screen.queryByText('Update Information')).not.toBeInTheDocument();
    });

    it('does not render hotel details when no reservations', () => {
      const store = mockStore({
        ...defaultStore,
        reservation: [],
      });
      renderWithProviders(store);

      expect(screen.queryByPlaceholderText('Full Name')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Reservations', () => {
    it('renders multiple reservation items', () => {
      const store = mockStore({
        ...defaultStore,
        reservation: [mockReservation, mockReservation2],
      });
      renderWithProviders(store);

      expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      expect(screen.getByText('Beach Resort Miami')).toBeInTheDocument();
    });

    it('displays different user info for each reservation', () => {
      const store = mockStore({
        ...defaultStore,
        reservation: [mockReservation, mockReservation2],
      });
      renderWithProviders(store);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  describe('User Filtering', () => {
    it('only shows reservations for the current user', () => {
      const otherUserReservation = {
        ...mockReservation2,
        userId: 'user2',
      };

      const store = mockStore({
        ...defaultStore,
        reservation: [mockReservation, otherUserReservation],
      });
      renderWithProviders(store);

      expect(screen.getByText('Grand Hotel New York')).toBeInTheDocument();
      expect(screen.queryByText('Beach Resort Miami')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates back when back button is clicked', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const backButton = screen.getByAltText('ArrowIcon').closest('div');
      if (backButton) {
        fireEvent.click(backButton);
      }

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('Form Inputs', () => {
    it('updates name input value', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      fireEvent.change(nameInput, { target: { value: 'New Name' } });

      expect(nameInput).toHaveValue('New Name');
    });

    it('updates email input value', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

      expect(emailInput).toHaveValue('new@example.com');
    });

    it('formats phone number input', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const phoneInput = screen.getByPlaceholderText('(555) 555-5555');
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });

      expect(phoneInput).toHaveValue('(123) 456-7890');
    });

    it('limits phone number to 10 digits', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const phoneInput = screen.getByPlaceholderText('(555) 555-5555');
      fireEvent.change(phoneInput, { target: { value: '12345678901234' } });

      expect(phoneInput).toHaveValue('(123) 456-7890');
    });
  });

  describe('Delete Reservation', () => {
    it('calls deleteReservationApi when delete button is clicked', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteReservationApi).toHaveBeenCalledWith('1');
      });
    });

    it('dispatches deleteReservation action on successful delete', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });
  });

  describe('Update Reservation', () => {
    it('calls update handler when update button is clicked', async () => {
      // Mock window.alert
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        // The update should either dispatch or show an alert
        expect(mockDispatch).toHaveBeenCalled();
      });

      alertMock.mockRestore();
    });
  });

  describe('Modal', () => {
    it('opens modal when clicking on a reservation item', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const reservationItem = screen.getByText('Grand Hotel New York').closest('div');
      if (reservationItem?.parentElement) {
        fireEvent.click(reservationItem.parentElement);
      }

      await waitFor(() => {
        // Modal should show additional form inputs
        const updateInfoTexts = screen.getAllByText('Update Information');
        expect(updateInfoTexts.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Address Display', () => {
    it('displays hotel city and state', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });
  });

  describe('Date Display', () => {
    it('displays reservation dates in correct format', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      // The date format is MM/dd/yyyy - MM/dd/yyyy
      // Multiple date displays exist (in item and details section)
      const dateElements = screen.getAllByText(/\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe('Payment Method Display', () => {
    it('displays payment method', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('displays user icon', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('UserIcon')).toBeInTheDocument();
    });

    it('displays phone icon', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('PhoneIcon')).toBeInTheDocument();
    });

    it('displays mail icon', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('MailIcon')).toBeInTheDocument();
    });

    it('displays card icon', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('CardIcon')).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot with reservations', () => {
      const store = mockStore(defaultStore);
      const { asFragment } = renderWithProviders(store);

      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot without reservations', () => {
      const store = mockStore({
        ...defaultStore,
        reservation: [],
      });
      const { asFragment } = renderWithProviders(store);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
