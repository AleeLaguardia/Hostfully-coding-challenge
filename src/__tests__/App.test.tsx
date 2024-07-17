import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { getHotels } from '../api/hotel';
import mockAxios from '../../__mocks__/axios';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../utils/theme';
import { Provider } from 'react-redux';
import store from '../store';

const data = [
  {
    "HotelId": "1",
    "ImageSource": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/78133927.jpg?k=96f840c9de7f4d412bef79a03d5f694fd9674ffcda920c6de8ed81682e431eac&o=&hp=1",
    "HotelName": "Secret Point Hotel",
    "Description": "This classic hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
    "Description_fr": "Cet hôtel classique est idéalement situé sur la principale artère commerciale de la ville en plein cœur de New York. A quelques minutes se trouve la place du temps et le centre historique de la ville, ainsi que d'autres lieux d'intérêt qui font de New York l'une des villes les plus attractives et cosmopolites de l'Amérique.",
    "Category": "Boutique",
    "Tags": [ "view", "air conditioning", "concierge" ],
    "ParkingIncluded": false,
    "LastRenovationDate": "2017-01-18T00:00:00Z",
    "Rating": 3.60,
    "Address": {
      "StreetAddress": "677 5th Ave",
      "City": "New York",
      "StateProvince": "NY",
      "PostalCode": "10022",
      "Country": "USA"
    },
    "Location": {
      "type": "Point",
      "coordinates": [ -73.975403, 40.760586 ]
    },
    "Rooms": [
      {
        "Description": "Budget Room, 1 Queen Bed (Cityside)",
        "Description_fr": "Chambre Économique, 1 grand lit (côté ville)",
        "Type": "Budget Room",
        "BaseRate": 96.99,
        "BedOptions": "1 Queen Bed",
        "SleepsCount": 2,
        "SmokingAllowed": true,
        "Tags": [ "vcr/dvd" ]
      },
      
    ]
  },
];

jest.mock('../components/MapComponent', () => {
  const MockMapComponent: React.FC<{ position: [number, number] }> = ({ position }) => (
    <div data-testid="mock-map-component">
      {/* Simulação de conteúdo do MapComponent */}
      <span>Mocked Map</span>
      <span>Latitude: {position[0]}</span>
      <span>Longitude: {position[1]}</span>
    </div>
  );
  return MockMapComponent;
});

jest.mock('../api/hotel', () => ({
  getHotels: jest.fn(),
}));

describe('App component', () => {
  beforeEach(() => {    
    jest.clearAllMocks();
    
    (getHotels as jest.Mock).mockResolvedValue({
      status: 200,
      data: data,
    });
    
    (mockAxios.get as jest.Mock).mockResolvedValue({
      data: { value: [] }
    });
  });

  it('renders Navigation component', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <App />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    );
    
    const PurpleLogo = screen.getByAltText('PurpleLogo');
    expect(PurpleLogo).toBeInTheDocument();
  });
});
