import { configureStore } from '@reduxjs/toolkit';
import reservationReducer, { addReservation, updateReservation, deleteReservation } from '../reservationSlice';
import { Hotel } from '../../../utils/types/hotelTypes';

type ReservationState = {
  name: string;
  phone: string;
  email: string;
  paymentMethod: string;
  date: any;
  hotel: Hotel;
};

const setupStore = (initialState: any) => {
  return configureStore({
    reducer: { reservation: reservationReducer },
    preloadedState: { reservation: initialState },
  });
};

describe('reservationSlice reducers', () => {
  const initialState = [
    {
      name: 'Tom Skolov',
      phone: '(917) 555 3256',
      email: 'tom.skolov32@gmail.com',
      paymentMethod: 'Credit Card',
      date: [new Date(), new Date(new Date().getTime() + 24 * 60 * 60 * 1000)],
      hotel: {
        HotelId: '1',
        ImageSource:
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/78133927.jpg?k=96f840c9de7f4d412bef79a03d5f694fd9674ffcda920c6de8ed81682e431eac&o=&hp=1',
        HotelName: 'Secret Point Hotel',
        Description:
          'This classic hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time\'s Square and the historic centre of the city, as well as other places of interest that make New York one of America\'s most attractive and cosmopolitan cities.',
        Description_fr:
          'Cet hôtel classique est idéalement situé sur la principale artère commerciale de la ville en plein cœur de New York. A quelques minutes se trouve la place du temps et le centre historique de la ville, ainsi que d\'autres lieux d\'intérêt qui font de New York l\'une des villes les plus attractives et cosmopolites de l\'Amérique.',
        Category: 'Boutique',
        Tags: ['view', 'air conditioning', 'concierge'],
        ParkingIncluded: false,
        LastRenovationDate: '2017-01-18T00:00:00Z',
        Rating: 3.6,
        Address: {
          StreetAddress: '677 5th Ave',
          City: 'New York',
          StateProvince: 'NY',
          PostalCode: '10022',
          Country: 'USA',
        },
        Location: {
          type: 'Point',
          coordinates: [-73.975403, 40.760586],
        },
        Rooms: [
          {
            Description: 'Budget Room, 1 Queen Bed (Cityside)',
            Description_fr: 'Chambre Économique, 1 grand lit (côté ville)',
            Type: 'Budget Room',
            BaseRate: 96.99,
            BedOptions: '1 Queen Bed',
            SleepsCount: 2,
            SmokingAllowed: true,
            Tags: ['vcr/dvd'],
          },
        ],
      },
    },
  ];

  it('should handle adding a reservation', () => {
    const store = setupStore(initialState);
    const newReservation: ReservationState = {
      name: 'John Doe',
      phone: '(123) 456 7890',
      email: 'john.doe@example.com',
      paymentMethod: 'PayPal',
      date: [new Date(), new Date(new Date().getTime() + 24 * 60 * 60 * 1000)],
      hotel: {
        HotelId: '2',
        ImageSource: '',
        HotelName: 'Example Hotel',
        Description: 'Example hotel description',
        Description_fr: 'Description de l\'hôtel exemple',
        Category: 'Luxury',
        Tags: ['wifi', 'pool'],
        ParkingIncluded: true,
        LastRenovationDate: '2020-01-01T00:00:00Z',
        Rating: 4.5,
        Address: {
          StreetAddress: '123 Main St',
          City: 'Example City',
          StateProvince: 'EX',
          PostalCode: '12345',
          Country: 'Example Country',
        },
        Location: {
          type: 'Point',
          coordinates: [0, 0],
        },
        Rooms: [
          {
            Description: 'Standard Room, 1 King Bed',
            Description_fr: 'Chambre Standard, 1 très grand lit',
            Type: 'Standard Room',
            BaseRate: 150.0,
            BedOptions: '1 King Bed',
            SleepsCount: 2,
            SmokingAllowed: false,
            Tags: ['view'],
          },
        ],
      },
    };

    store.dispatch(addReservation(newReservation));
    const state = store.getState().reservation;
    expect(state.length).toEqual(2);
    expect(state[1]).toEqual(newReservation);
  });

  it('should handle updating a reservation', () => {
    const store = setupStore(initialState);
    const updatedInfo = {
      phone: '(999) 888 7777',
      paymentMethod: 'Credit Card',
    };

    store.dispatch(updateReservation({ index: 0, reservation: updatedInfo }));
    const state = store.getState().reservation;
    expect(state[0].phone).toEqual(updatedInfo.phone);
    expect(state[0].paymentMethod).toEqual(updatedInfo.paymentMethod);
  });

  it('should handle deleting a reservation', () => {
    const store = setupStore(initialState);
    store.dispatch(deleteReservation(0));
    const state = store.getState().reservation;
    expect(state.length).toEqual(0);
  });
});
