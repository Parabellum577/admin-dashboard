import { PlaceRequest, PlaceResponse, EditPlaceRequest, GetReservationsRequest, GetReservationsResponse } from 'types/places';
import { SubscriptionsResponse } from 'types/subscriptions';
import axiosApi from './config';
import moment from 'moment';

const PlacesApi = {
  createPlace(data: PlaceRequest): Promise<PlaceResponse> {
    const url = 'places';
    return axiosApi.post(url, data);
  },
  editPlace(data: EditPlaceRequest): Promise<PlaceResponse> {
    const url = `places/${data.id}`;
    return axiosApi.put(url, data.data);
  },
  getPlaces({
    type = '',
    query = '',
    limit = '10',
    offset = 0,
  }): Promise<PlaceResponse> {
    const params = new URLSearchParams({
      query: query,
      limit,
      offset: offset.toString(),
    });
    const url = `/places?${params.toString()}${type ? `&filter[type]=${type}` : ''}`;
    return axiosApi.get(url);
  },
  getPlaceById(id: string): Promise<PlaceResponse> {
    const url = `places/${id}`;
    return axiosApi.get(url);
  },
  deletePlace(id: string): Promise<PlaceResponse> {
    const url = `places/${id}`;
    return axiosApi.delete(url);
  },
  getSubscriptions(): Promise<SubscriptionsResponse[]> {
    const url = `subscription`;
    return axiosApi.get(url);
  },
  getReservationsByPlaceId({
    placeId = '',
    startDate = null,
  }: GetReservationsRequest): Promise<GetReservationsResponse> {
    const endDate = moment(startDate).add(1, 'days').startOf('day');

    const url = `/reservations/place/rooms/${placeId}?
    ${startDate && endDate ?
        `&filter[startDate]=${moment(startDate).startOf('day').toDate()}
         &filter[endDate]=${endDate.toDate()}`
        : ''}`;

    return axiosApi.get(url);
  },
  getPlaceImageSignedUrl(type: string): Promise<{ url: string, fileLocation: string }> {
    const url = `places/signed-url/${type}`;
    return axiosApi.get(url);
  },
};

export default PlacesApi;
