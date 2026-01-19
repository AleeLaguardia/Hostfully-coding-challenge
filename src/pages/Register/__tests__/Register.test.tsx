import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import configureStore from 'redux-mock-store';
import Register from '..';
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
  registerUser: Object.assign(
    jest.fn((payload) => ({
      type: 'auth/registerUser',
      payload,
    })),
    {
      fulfilled: {
        match: jest.fn((action) => action?.type === 'auth/registerUser/fulfilled'),
      },
      pending: { type: 'auth/registerUser/pending' },
      rejected: { type: 'auth/registerUser/rejected' },
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

const renderWithProviders = (store: any) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register']}>
        <ThemeProvider theme={theme}>
          <Register />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders register form', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByAltText('Logo')).toBeInTheDocument();
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password (min 6 characters)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('renders login link', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('login link points to login page', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const loginLink = screen.getByText('Login');
      expect(loginLink).toHaveAttribute('href', PATH.LOGIN);
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
    it('updates name input value', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      expect(nameInput).toHaveValue('John Doe');
    });

    it('updates email input value', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      expect(emailInput).toHaveValue('john@example.com');
    });

    it('updates password input value', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput).toHaveValue('password123');
    });

    it('updates confirm password input value', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      expect(confirmPasswordInput).toHaveValue('password123');
    });

    it('email input has type email', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('password inputs have type password', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('does not dispatch with invalid name (numbers)', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John123' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('does not dispatch with short name', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'J' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('does not dispatch with invalid email', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('does not dispatch with short password (less than 6 chars)', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '12345' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('does not dispatch when passwords do not match', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('dispatches with all valid inputs', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it('accepts name with spaces', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John Michael Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('can submit form using Enter key', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const form = screen.getByText('Register').closest('form');
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

    it('shows Register text when isLoading is false', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.getByText('Register')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error exists', () => {
      const store = mockStore({
        auth: {
          ...defaultStore.auth,
          error: 'Email already registered',
        },
      });
      renderWithProviders(store);

      expect(screen.getByText('Email already registered')).toBeInTheDocument();
    });

    it('does not display error message when no error', () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      expect(screen.queryByText('Email already registered')).not.toBeInTheDocument();
    });

    it('displays registration failed error', () => {
      const store = mockStore({
        auth: {
          ...defaultStore.auth,
          error: 'Registration failed',
        },
      });
      renderWithProviders(store);

      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty name', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('handles empty email', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('handles empty password fields', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('handles password exactly 6 characters', async () => {
      const store = mockStore(defaultStore);
      renderWithProviders(store);

      const nameInput = screen.getByPlaceholderText('Full Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password (min 6 characters)');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      const registerButton = screen.getByText('Register');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '123456' } });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
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
          error: 'Email already registered',
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
