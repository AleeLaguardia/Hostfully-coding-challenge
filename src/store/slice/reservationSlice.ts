import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Hotel } from "../../utils/types/hotelTypes";

interface ReservationState {
  name: string;
  phone: string;
  email: string;
  paymentMethod: string;
  date: any;
  hotel: Hotel;
}

const initialState: ReservationState[] = [
  {
    name: "Tom Skolov",
    phone: "(917) 555 3256",
    email: "tom.skolov32@gmail.com",
    paymentMethod: "Credit Card",
    date: [new Date(), new Date(new Date().getTime() + 24 * 60 * 60 * 1000)],
    hotel: {
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
        {
          "Description": "Budget Room, 1 King Bed (Mountain View)",
          "Description_fr": "Chambre Économique, 1 très grand lit (Mountain View)",
          "Type": "Budget Room",
          "BaseRate": 80.99,
          "BedOptions": "1 King Bed",
          "SleepsCount": 2,
          "SmokingAllowed": true,
          "Tags": [ "vcr/dvd", "jacuzzi tub" ]
        },
        {
          "Description": "Deluxe Room, 2 Double Beds (City View)",
          "Description_fr": "Chambre Deluxe, 2 lits doubles (vue ville)",
          "Type": "Deluxe Room",
          "BaseRate": 150.99,
          "BedOptions": "2 Double Beds",
          "SleepsCount": 2,
          "SmokingAllowed": false,
          "Tags": [ "suite", "bathroom shower", "coffee maker" ]
        },
        {
          "Description": "Standard Room, 1 King Bed (Amenities)",
          "Description_fr": "Chambre Standard, 1 très grand lit (Services)",
          "Type": "Standard Room",
          "BaseRate": 110.99,
          "BedOptions": "1 King Bed",
          "SleepsCount": 2,
          "SmokingAllowed": false,
          "Tags": [ "Room Tags", "bathroom shower", "bathroom shower" ]
        },
        {
          "Description": "Suite, 1 Queen Bed (Mountain View)",
          "Description_fr": "Suite, 1 grand lit (vue sur la montagne)",
          "Type": "Suite",
          "BaseRate": 243.99,
          "BedOptions": "1 Queen Bed",
          "SleepsCount": 2,
          "SmokingAllowed": false,
          "Tags": [ "Room Tags" ]
        },
        {
          "Description": "Suite, 2 Queen Beds (Mountain View)",
          "Description_fr": "Suite, 2 grands lits (vue sur la montagne)",
          "Type": "Suite",
          "BaseRate": 229.99,
          "BedOptions": "2 Queen Beds",
          "SleepsCount": 4,
          "SmokingAllowed": true,
          "Tags": [ "vcr/dvd" ]
        },
        {
          "Description": "Budget Room, 1 King Bed (Waterfront View)",
          "Description_fr": "Chambre Économique, 1 très grand lit (vue sur le front de mer)",
          "Type": "Budget Room",
          "BaseRate": 87.99,
          "BedOptions": "1 King Bed",
          "SleepsCount": 2,
          "SmokingAllowed": false,
          "Tags": [ "tv" ]
        },
        {
          "Description": "Suite, 1 King Bed (Waterfront View)",
          "Description_fr": "Suite, 1 très grand lit (vue sur le front de mer)",
          "Type": "Suite",
          "BaseRate": 262.99,
          "BedOptions": "1 King Bed",
          "SleepsCount": 2,
          "SmokingAllowed": false,
          "Tags": [ "vcr/dvd", "vcr/dvd" ]
        },
        {
          "Description": "Suite, 2 Double Beds (Mountain View)",
          "Description_fr": "Suite, 2 lits doubles (vue sur la montagne)",
          "Type": "Suite",
          "BaseRate": 248.99,
          "BedOptions": "2 Double Beds",
          "SleepsCount": 2,
          "SmokingAllowed": false,
          "Tags": [ "coffee maker", "coffee maker", "coffee maker" ]
        },
        {
          "Description": "Suite, 1 King Bed (Mountain View)",
          "Description_fr": "Suite, 1 très grand lit (vue sur la montagne)",
          "Type": "Suite",
          "BaseRate": 234.99,
          "BedOptions": "1 King Bed",
          "SleepsCount": 2,
          "SmokingAllowed": true,
          "Tags": [ "tv" ]
        },
        {
          "Description": "Deluxe Room, 1 King Bed (City View)",
          "Description_fr": "Chambre Deluxe, 1 très grand lit (vue ville)",
          "Type": "Deluxe Room",
          "BaseRate": 146.99,
          "BedOptions": "1 King Bed",
          "SleepsCount": 2,
          "SmokingAllowed": false,
          "Tags": [ "bathroom shower" ]
        },
        {
          "Description": "Standard Room, 1 King Bed (Waterfront View)",
          "Description_fr": "Chambre Standard, 1 très grand lit (vue sur le front de mer)",
          "Type": "Standard Room",
          "BaseRate": 121.99,
          "BedOptions": "1 King Bed",
          "SleepsCount": 2,
          "SmokingAllowed": false,
          "Tags": [ "bathroom shower", "vcr/dvd" ]
        },
        {
          "Description": "Standard Room, 2 Double Beds (City View)",
          "Description_fr": "Chambre Standard, 2 lits doubles (vue ville)",
          "Type": "Standard Room",
          "BaseRate": 128.99,
          "BedOptions": "2 Double Beds",
          "SleepsCount": 2,
          "SmokingAllowed": true,
          "Tags": [ "suite", "coffee maker", "jacuzzi tub" ]
        }
      ]
    },
  }
];

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<ReservationState>) => {
      state.push(action.payload);
    },
    updateReservation: (state, action: PayloadAction<{ index: number, reservation: Partial<ReservationState> }>) => {
      const { index, reservation } = action.payload;
      if (index >= 0 && index < state.length) {
        state[index] = { ...state[index], ...reservation};
      }
    },
    deleteReservation: (state, action: PayloadAction<number>) => {
      const indexToDelete = action.payload;
      if (indexToDelete >= 0 && indexToDelete < state.length) {
        state.splice(indexToDelete, 1);
      }
    },
  },
});

export const { addReservation, updateReservation, deleteReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
