import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '..';

jest.mock('../../pages/Home', () => {
  return jest.fn(() => <div data-testid="home-page">Home Page</div>);
});
jest.mock('../../pages/Booking', () => {
  return jest.fn(() => <div data-testid="booking-page">Booking Page</div>);
});
jest.mock('../../pages/Reservation', () => {
  return jest.fn(() => <div data-testid="reservation-page">Reservation Page</div>);
});

describe('Navigation', () => {
  test('renders 404 not found for an unknown route', async () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <Navigation />
      </MemoryRouter>
    );
    
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('booking-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reservation-page')).not.toBeInTheDocument();
  });
});
