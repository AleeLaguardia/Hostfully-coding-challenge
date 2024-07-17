import { LatLngExpression } from "leaflet";

export type Location = {
  coordinates: LatLngExpression;
  type: string;
}

export type Room = {
  BaseRate: number;
  BedOptions?: string;
  Description?: string;
  Description_fr?: string;
  SleepsCount?: number
  SmokingAllowed?: boolean;
  Tags?: string[];
  Type?: string;
}

export type AddressType = {
  StreetAddress: string;
  City: string;
  StateProvince: string;
  PostalCode: string;
  Country: string;
}

export type Hotel = {
  HotelId: string;
  ImageSource: string;
  HotelName: string;
  Description: string;
  Description_fr: string;
  Category: string;
  Tags: string[];
  ParkingIncluded: boolean,
  LastRenovationDate: string;
  Rating: number;
  Address: AddressType;
  Rooms: Room[];
  Location: Location;
}