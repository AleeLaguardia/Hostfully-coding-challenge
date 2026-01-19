import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import PrivateRoute from '..';
import { PATH } from '../../../utils/strings';

const mockStore = configureStore([]);

const ProtectedContent = () => <div data-testid="protected-content">Protected Content</div>;
const LoginPage = () => <div data-testid="login-page">Login Page</div>;

const renderWithProviders = (
  store: any,
  initialEntries: string[] = ['/protected']
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedContent />
              </PrivateRoute>
            }
          />
          <Route path={PATH.LOGIN} element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('PrivateRoute Component', () => {
  describe('When user is authenticated', () => {
    const authenticatedStore = {
      auth: {
        isAuthenticated: true,
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        isLoading: false,
        error: null,
      },
    };

    it('renders children when user is authenticated', () => {
      const store = mockStore(authenticatedStore);
      renderWithProviders(store);

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('does not redirect to login page', () => {
      const store = mockStore(authenticatedStore);
      renderWithProviders(store);

      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('renders any children passed to it', () => {
      const store = mockStore(authenticatedStore);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <PrivateRoute>
                    <div data-testid="custom-child">Custom Child Component</div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByText('Custom Child Component')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      const store = mockStore(authenticatedStore);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <PrivateRoute>
                    <div data-testid="child-1">Child 1</div>
                    <div data-testid="child-2">Child 2</div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });

  describe('When user is not authenticated', () => {
    const unauthenticatedStore = {
      auth: {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      },
    };

    it('redirects to login page when user is not authenticated', () => {
      const store = mockStore(unauthenticatedStore);
      renderWithProviders(store);

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('does not render protected content', () => {
      const store = mockStore(unauthenticatedStore);
      renderWithProviders(store);

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('redirects from any protected route', () => {
      const store = mockStore(unauthenticatedStore);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/booking']}>
            <Routes>
              <Route
                path="/booking"
                element={
                  <PrivateRoute>
                    <div data-testid="booking-content">Booking Page</div>
                  </PrivateRoute>
                }
              />
              <Route path={PATH.LOGIN} element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('booking-content')).not.toBeInTheDocument();
    });

    it('redirects from reservation route', () => {
      const store = mockStore(unauthenticatedStore);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/reservation']}>
            <Routes>
              <Route
                path="/reservation"
                element={
                  <PrivateRoute>
                    <div data-testid="reservation-content">Reservation Page</div>
                  </PrivateRoute>
                }
              />
              <Route path={PATH.LOGIN} element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('reservation-content')).not.toBeInTheDocument();
    });
  });

  describe('Authentication state transitions', () => {
    it('behavior depends on isAuthenticated value at render time', () => {
      // When authenticated at render time, shows protected content
      const authStore = mockStore({
        auth: {
          isAuthenticated: true,
          user: { id: '1', name: 'John Doe', email: 'john@example.com' },
          isLoading: false,
          error: null,
        },
      });

      const { unmount } = render(
        <Provider store={authStore}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <PrivateRoute>
                    <ProtectedContent />
                  </PrivateRoute>
                }
              />
              <Route path={PATH.LOGIN} element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      unmount();

      // When not authenticated at render time, redirects
      const unauthStore = mockStore({
        auth: {
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        },
      });

      render(
        <Provider store={unauthStore}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <PrivateRoute>
                    <ProtectedContent />
                  </PrivateRoute>
                }
              />
              <Route path={PATH.LOGIN} element={<LoginPage />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles null user with isAuthenticated false', () => {
      const store = mockStore({
        auth: {
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        },
      });
      renderWithProviders(store);

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles loading state with isAuthenticated false', () => {
      const store = mockStore({
        auth: {
          isAuthenticated: false,
          user: null,
          isLoading: true,
          error: null,
        },
      });
      renderWithProviders(store);

      // Still redirects because isAuthenticated is false
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('handles error state with isAuthenticated false', () => {
      const store = mockStore({
        auth: {
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Some error',
        },
      });
      renderWithProviders(store);

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('renders children with empty user object when authenticated', () => {
      const store = mockStore({
        auth: {
          isAuthenticated: true,
          user: {},
          isLoading: false,
          error: null,
        },
      });
      renderWithProviders(store);

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot when authenticated', () => {
      const store = mockStore({
        auth: {
          isAuthenticated: true,
          user: { id: '1', name: 'John Doe', email: 'john@example.com' },
          isLoading: false,
          error: null,
        },
      });

      const { asFragment } = renderWithProviders(store);
      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot when not authenticated (redirects)', () => {
      const store = mockStore({
        auth: {
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        },
      });

      const { asFragment } = renderWithProviders(store);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
