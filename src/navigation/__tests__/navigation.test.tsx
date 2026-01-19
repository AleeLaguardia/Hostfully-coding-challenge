import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store';
import Navigation from '..';

jest.mock('../../api/auth', () => ({
  loginApi: jest.fn(),
  registerApi: jest.fn(),
  getAllReservations: jest.fn().mockResolvedValue({ data: [] }),
  createReservation: jest.fn(),
}));

jest.mock('../../api/hotel', () => ({
  getHotels: jest.fn().mockResolvedValue({ status: 200, data: { value: [] } }),
}));

jest.mock('../../pages/Home', () => {
  return jest.fn(() => <div data-testid="home-page">Home Page</div>);
});
jest.mock('../../pages/Booking', () => {
  return jest.fn(() => <div data-testid="booking-page">Booking Page</div>);
});
jest.mock('../../pages/Reservation', () => {
  return jest.fn(() => <div data-testid="reservation-page">Reservation Page</div>);
});
jest.mock('../../pages/Login', () => {
  return jest.fn(() => <div data-testid="login-page">Login Page</div>);
});
jest.mock('../../pages/Register', () => {
  return jest.fn(() => <div data-testid="register-page">Register Page</div>);
});

describe('Navigation', () => {
  test('renders 404 not found for an unknown route', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/unknown']}>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('booking-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reservation-page')).not.toBeInTheDocument();
  });
});
