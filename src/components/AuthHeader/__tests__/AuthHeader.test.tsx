import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import configureStore from 'redux-mock-store';
import AuthHeader from '..';
import { theme } from '../../../utils/theme';
import { PATH } from '../../../utils/strings';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../api/auth', () => ({
  loginApi: jest.fn(),
  registerApi: jest.fn(),
}));

const mockStore = configureStore([]);

const renderWithProviders = (store: any) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthHeader />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('AuthHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When user is not authenticated', () => {
    let store: any;

    beforeEach(() => {
      store = mockStore({
        auth: {
          isAuthenticated: false,
          user: null,
        },
      });
    });

    it('renders Login and Register buttons', () => {
      renderWithProviders(store);

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('does not render profile button', () => {
      renderWithProviders(store);

      expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
    });

    it('navigates to login page when Login button is clicked', () => {
      renderWithProviders(store);

      fireEvent.click(screen.getByText('Login'));

      expect(mockNavigate).toHaveBeenCalledWith(PATH.LOGIN);
    });

    it('navigates to register page when Register button is clicked', () => {
      renderWithProviders(store);

      fireEvent.click(screen.getByText('Register'));

      expect(mockNavigate).toHaveBeenCalledWith(PATH.REGISTER);
    });

    it('renders with correct styling (snapshot)', () => {
      const { asFragment } = renderWithProviders(store);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('When user is authenticated', () => {
    let store: any;
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    beforeEach(() => {
      store = mockStore({
        auth: {
          isAuthenticated: true,
          user: mockUser,
        },
      });
    });

    it('renders profile button', () => {
      renderWithProviders(store);

      expect(screen.getByAltText('Profile')).toBeInTheDocument();
    });

    it('does not render Login and Register buttons', () => {
      renderWithProviders(store);

      expect(screen.queryByText('Login')).not.toBeInTheDocument();
      expect(screen.queryByText('Register')).not.toBeInTheDocument();
    });

    it('does not show dropdown menu initially', () => {
      renderWithProviders(store);

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('Reservation')).not.toBeInTheDocument();
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('shows dropdown menu when profile button is clicked', () => {
      renderWithProviders(store);

      fireEvent.click(screen.getByAltText('Profile'));

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Reservation')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('hides dropdown menu when profile button is clicked again', () => {
      renderWithProviders(store);

      const profileButton = screen.getByAltText('Profile');

      fireEvent.click(profileButton);
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      fireEvent.click(profileButton);
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('navigates to reservation page when Reservation is clicked', () => {
      renderWithProviders(store);

      fireEvent.click(screen.getByAltText('Profile'));
      fireEvent.click(screen.getByText('Reservation'));

      expect(mockNavigate).toHaveBeenCalledWith(PATH.RESERVATION);
    });

    it('dispatches logout action and navigates to login when Logout is clicked', () => {
      renderWithProviders(store);

      fireEvent.click(screen.getByAltText('Profile'));
      fireEvent.click(screen.getByText('Logout'));

      const actions = store.getActions();
      expect(actions).toContainEqual({ type: 'auth/logout' });
      expect(mockNavigate).toHaveBeenCalledWith(PATH.LOGIN);
    });

    it('closes dropdown menu after clicking Reservation', () => {
      renderWithProviders(store);

      fireEvent.click(screen.getByAltText('Profile'));
      expect(screen.getByText('Reservation')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Reservation'));
      expect(screen.queryByText('Reservation')).not.toBeInTheDocument();
    });

    it('closes dropdown menu after clicking Logout', () => {
      renderWithProviders(store);

      fireEvent.click(screen.getByAltText('Profile'));
      expect(screen.getByText('Logout')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Logout'));
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('displays correct user name in dropdown', () => {
      const customStore = mockStore({
        auth: {
          isAuthenticated: true,
          user: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        },
      });

      renderWithProviders(customStore);

      fireEvent.click(screen.getByAltText('Profile'));

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders authenticated state with correct styling (snapshot)', () => {
      const { asFragment } = renderWithProviders(store);

      expect(asFragment()).toMatchSnapshot();
    });

    it('renders dropdown menu with correct styling (snapshot)', () => {
      const { asFragment } = renderWithProviders(store);

      fireEvent.click(screen.getByAltText('Profile'));

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Edge cases', () => {
    it('handles authenticated state with null user gracefully', () => {
      const store = mockStore({
        auth: {
          isAuthenticated: true,
          user: null,
        },
      });

      renderWithProviders(store);

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('handles user with empty name', () => {
      const store = mockStore({
        auth: {
          isAuthenticated: true,
          user: { id: '1', name: '', email: 'test@example.com' },
        },
      });

      renderWithProviders(store);

      fireEvent.click(screen.getByAltText('Profile'));

      expect(screen.getByText('Reservation')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });
});
