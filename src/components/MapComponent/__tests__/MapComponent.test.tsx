import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../../utils/theme';

// Mock CSS imports
jest.mock('leaflet/dist/leaflet.css', () => ({}));

// Mock leaflet
jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      mergeOptions: jest.fn(),
    },
  },
}));

// Mock fixLeafletIcon
jest.mock('../../../fixLeafletIcon', () => ({}));

// Create mocks for useMap hook
const mockSetView = jest.fn();
const mockGetZoom = jest.fn();

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, center, zoom, style, dragging }: any) => (
    <div
      data-testid="map-container"
      data-center={JSON.stringify(center)}
      data-zoom={zoom}
      data-dragging={dragging}
      style={style}
    >
      {children}
    </div>
  ),
  TileLayer: ({ url, attribution }: any) => (
    <div data-testid="tile-layer" data-url={url} data-attribution={attribution} />
  ),
  Marker: ({ position }: any) => (
    <div data-testid="marker" data-position={JSON.stringify(position)} />
  ),
  useMap: () => ({
    setView: mockSetView,
    getZoom: mockGetZoom,
  }),
}));

// Import MapComponent after mocks are set up
import MapComponent from '..';

const renderWithTheme = (position: [number, number]) => {
  return render(
    <ThemeProvider theme={theme}>
      <MapComponent position={position} />
    </ThemeProvider>
  );
};

describe('MapComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithTheme([-74.006, 40.7128]);

      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('renders MapContainer with correct props', () => {
      renderWithTheme([-74.006, 40.7128]);

      const mapContainer = screen.getByTestId('map-container');
      expect(mapContainer).toHaveAttribute('data-zoom', '10');
      expect(mapContainer).toHaveAttribute('data-dragging', 'false');
      expect(mapContainer).toHaveStyle({ height: '100%', width: '100%' });
    });

    it('renders TileLayer with OpenStreetMap URL', () => {
      renderWithTheme([-74.006, 40.7128]);

      const tileLayer = screen.getByTestId('tile-layer');
      expect(tileLayer).toHaveAttribute(
        'data-url',
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      );
    });

    it('renders TileLayer with correct attribution', () => {
      renderWithTheme([-74.006, 40.7128]);

      const tileLayer = screen.getByTestId('tile-layer');
      // HTML entity &copy; is converted to © character
      expect(tileLayer).toHaveAttribute(
        'data-attribution',
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      );
    });

    it('renders Marker component', () => {
      renderWithTheme([-74.006, 40.7128]);

      expect(screen.getByTestId('marker')).toBeInTheDocument();
    });
  });

  describe('Position Formatting', () => {
    it('swaps longitude and latitude correctly for New York coordinates', () => {
      // Input: [longitude, latitude] = [-74.006, 40.7128]
      // Expected output: [latitude, longitude] = [40.7128, -74.006]
      renderWithTheme([-74.006, 40.7128]);

      const mapContainer = screen.getByTestId('map-container');
      const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      expect(center).toEqual([40.7128, -74.006]);
    });

    it('swaps longitude and latitude correctly for Miami coordinates', () => {
      // Input: [longitude, latitude] = [-80.1918, 25.7617]
      // Expected output: [latitude, longitude] = [25.7617, -80.1918]
      renderWithTheme([-80.1918, 25.7617]);

      const mapContainer = screen.getByTestId('map-container');
      const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      expect(center).toEqual([25.7617, -80.1918]);
    });

    it('passes formatted position to Marker', () => {
      renderWithTheme([-74.006, 40.7128]);

      const marker = screen.getByTestId('marker');
      const position = JSON.parse(marker.getAttribute('data-position') || '[]');
      expect(position).toEqual([40.7128, -74.006]);
    });

    it('handles positive longitude coordinates', () => {
      // London coordinates: [longitude, latitude] = [-0.1276, 51.5074]
      renderWithTheme([-0.1276, 51.5074]);

      const mapContainer = screen.getByTestId('map-container');
      const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      expect(center).toEqual([51.5074, -0.1276]);
    });

    it('handles coordinates with zero values', () => {
      renderWithTheme([0, 0]);

      const mapContainer = screen.getByTestId('map-container');
      const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      expect(center).toEqual([0, 0]);
    });

    it('handles negative latitude and longitude', () => {
      // Sydney coordinates: [longitude, latitude] = [151.2093, -33.8688]
      renderWithTheme([151.2093, -33.8688]);

      const mapContainer = screen.getByTestId('map-container');
      const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      expect(center).toEqual([-33.8688, 151.2093]);
    });
  });

  describe('Map Configuration', () => {
    it('disables dragging on the map', () => {
      renderWithTheme([-74.006, 40.7128]);

      const mapContainer = screen.getByTestId('map-container');
      expect(mapContainer).toHaveAttribute('data-dragging', 'false');
    });

    it('sets zoom level to 10', () => {
      renderWithTheme([-74.006, 40.7128]);

      const mapContainer = screen.getByTestId('map-container');
      expect(mapContainer).toHaveAttribute('data-zoom', '10');
    });

    it('sets map container to full width and height', () => {
      renderWithTheme([-74.006, 40.7128]);

      const mapContainer = screen.getByTestId('map-container');
      expect(mapContainer).toHaveStyle({ height: '100%', width: '100%' });
    });
  });

  describe('MapMarker Component', () => {
    it('calls setView with position when position changes', () => {
      renderWithTheme([-74.006, 40.7128]);

      // The MapMarker uses useMap hook which calls setView
      // Verify setView was called with the correctly formatted position
      expect(mockSetView).toHaveBeenCalled();
      expect(mockSetView.mock.calls[0][0]).toEqual([40.7128, -74.006]);
    });

    it('gets current zoom level from map', () => {
      renderWithTheme([-74.006, 40.7128]);

      expect(mockGetZoom).toHaveBeenCalled();
    });
  });

  describe('Different Locations', () => {
    const testCases = [
      { name: 'New York', coords: [-74.006, 40.7128], expected: [40.7128, -74.006] },
      { name: 'Miami', coords: [-80.1918, 25.7617], expected: [25.7617, -80.1918] },
      { name: 'Los Angeles', coords: [-118.2437, 34.0522], expected: [34.0522, -118.2437] },
      { name: 'Tokyo', coords: [139.6917, 35.6895], expected: [35.6895, 139.6917] },
      { name: 'Paris', coords: [2.3522, 48.8566], expected: [48.8566, 2.3522] },
    ];

    testCases.forEach(({ name, coords, expected }) => {
      it(`renders correctly for ${name}`, () => {
        renderWithTheme(coords as [number, number]);

        const mapContainer = screen.getByTestId('map-container');
        const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
        expect(center).toEqual(expected);
      });
    });
  });

  describe('Snapshot', () => {
    it('matches snapshot', () => {
      const { asFragment } = renderWithTheme([-74.006, 40.7128]);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
