import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { getHotels } from '../api/hotel';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../utils/theme';
import { Provider } from 'react-redux';
import store from '../store';

jest.mock('../components/MapComponent', () => {
  const MockMapComponent: React.FC<{ position: [number, number] }> = ({ position }) => (
    <div data-testid="mock-map-component">
      <span>Mocked Map</span>
    </div>
  );
  return MockMapComponent;
});

jest.mock('../api/hotel', () => ({
  getHotels: jest.fn(),
}));

jest.mock('../api/auth', () => ({
  getAllReservations: jest.fn().mockResolvedValue({ data: [] }),
}));

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getHotels as jest.Mock).mockResolvedValue({
      status: 200,
      data: { value: [] },
    });
  });

  it('renders Navigation component', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <App />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const PurpleLogo = screen.getByAltText('PurpleLogo');
      expect(PurpleLogo).toBeInTheDocument();
    });
  });
});
