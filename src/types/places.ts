import { City } from 'models/cities'
import { Member } from "models/member";

export type Place = {
  _id: string;
  name: string;
  code?: string;
  description: string;
  address: string;
  membersOnly: boolean;
  type: string;
  city: City,
  rooms: Room[];
  tags: string[];
  allowedSubscriptions: string[],
  isReservationEnabled: boolean,
  image: string,
  photos: string[],
  availability: string[],
}

export type PlaceResponse = {
  data: Place[];
  total: number;
}

export type PlaceRequest = {
  name: string;
  description: string;
  address: string;
  type: string;
  city: string;
  membersOnly: boolean;
  tags: string[];
  allowedSubscriptions?: string[],
}

export type PlacesRequest = {
  type?: string;
  limit?: string;
  offset?: number;
  query?: string;
}

export type EditPlaceRequest = {
  data: PlaceRequest;
  id: string;
}

export type GetReservationsRequest = {
  placeId: string;
  startDate: string | null | Date;
  offset?: number;
  limit?: string;
}

export type Room = {
  name: string;
  _id: string;
  times: string[];
}

export interface ReservedRoom {
  createdAt: string;
  date: string;
  place: string;
  rooms: Room[];
  user: Partial<Member>;
  _id: string;
}

export type GetReservationsResponse = ReservedRoom[]

export type GetAllPlacesResponse = Place[];

export type SignedUrlResponse = { url: string, fileLocation: string };