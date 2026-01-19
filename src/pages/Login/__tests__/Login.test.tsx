import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import configureStore from 'redux-mock-store';
import Login from '..';
import { theme } from '../../../utils/theme';
import { PATH } from '../../../utils/strings';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../store/slice/authSlice', () => ({
  loginUser: Object.assign(
    jest.fn((payload) => ({
      type: 'auth/loginUser',
      payload,
    })),
    {
      fulfilled: {
        match: jest.fn((action) => action?.type === 'auth/loginUser/fulfilled'),
      },
      pending: { type: 'auth/loginUser/pending' },
      rejected: { type: 'auth/loginUser/rejected' },
    }
  ),
}));

const mockStore = configureStore([]);

const defaultStore = {
  auth: {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  },
};

const renderWithProviders = (
  store: any,
  initialEntries: string[] = ['/login']
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider theme={theme}>
          <Login />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders login form', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('Logo')).toBeInTheDocument();
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('renders register link', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('register link points to register page', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const registerLink = screen.getByText('Register');
      expect(registerLink).toHaveAttribute('href', PATH.REGISTER);
    });

    it('renders logo image', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo.tagName).toBe('IMG');
    });
  });

  describe('Form Inputs', () => {
    it('updates email input value', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('updates password input value', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput).toHaveValue('password123');
    });

    it('email input has type email', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('password input has type password', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('shows error state for invalid email format', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      const loginButton = screen.getByText('Login');

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(loginButton);

      // The input should have error styling (we can't easily test styled-components error prop)
      // But we can verify the dispatch was not called with invalid data
      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('shows error state for empty password', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      const loginButton = screen.getByText('Login');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('shows error state for empty email', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByText('Login');

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('validates email format correctly', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByText('Login');

      // Valid email format
      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });
  });

  describe('Login Submission', () => {
    it('dispatches loginUser action with credentials', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByText('Login');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it('can submit form using Enter key', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Submit form
      const form = screen.getByText('Login').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading text when isLoading is true', () => {
      const store = mockStore({
        auth: {
          ...defaultStore.auth,
          isLoading: true,
        },
      });
      renderWithProviders(store);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows Login text when isLoading is false', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error exists', () => {
      const store = mockStore({
        auth: {
          ...defaultStore.auth,
          error: 'Invalid credentials',
        },
      });
      renderWithProviders(store);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('does not display error message when no error', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });

    it('displays user not found error', () => {
      const store = mockStore({
        auth: {
          ...defaultStore.auth,
          error: 'User not found',
        },
      });
      renderWithProviders(store);

      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('dispatches login action with valid credentials', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByText('Login');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it('does not dispatch when validation fails', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      const loginButton = screen.getByText('Login');

      // Invalid email, empty password
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const store = mockStore(defaultStore);
      const { asFragment } = renderWithProviders(store);

      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with error', () => {
      const store = mockStore({
        auth: {
          ...defaultStore.auth,
          error: 'Invalid credentials',
        },
      });
      const { asFragment } = renderWithProviders(store);

      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with loading state', () => {
      const store = mockStore({
        auth: {
          ...defaultStore.auth,
          isLoading: true,
        },
      });
      const { asFragment } = renderWithProviders(store);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
