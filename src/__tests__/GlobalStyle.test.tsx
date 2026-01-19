import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { GlobalStyle } from '../GlobalStyle';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../utils/theme';
import store from '../store';
import { Provider } from 'react-redux';
import { getHotels } from '../api/hotel';

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

describe('GlobalStyle', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getHotels as jest.Mock).mockResolvedValue({
      status: 200,
      data: { value: [] },
    });
  });

  it('applies global styles correctly', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <GlobalStyle />
            <App />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const rootElement = screen.getByTestId('root');
      expect(rootElement).toBeInTheDocument();
    });
  });
});
