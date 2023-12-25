import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlaceRequest, Place, EditPlaceRequest, GetReservationsRequest, GetReservationsResponse, PlacesRequest, PlaceResponse } from 'types/places';
import { SubscriptionsResponse } from 'types/subscriptions';

export interface PlacesState {
  loading: boolean;
  signedUrlsLoading: boolean;
  places: Place[];
  subscriptions: SubscriptionsResponse[];
  selectedPlace: Place | null;
  reservations: GetReservationsResponse | null
  error: any;
  signedUrlsError: any;
  offset: number;
  total: number;
};

const initialState: PlacesState = {
  loading: false,
  signedUrlsLoading: false,
  signedUrlsError: null,
  error: null,
  places: [],
  subscriptions: [],
  selectedPlace: null,
  reservations: null,
  offset: 0,
  total: 0,
};

const PlacesSlice = createSlice({
  name: 'places',
  initialState: initialState,
  reducers: {
    getPlaces(state: PlacesState, action: PayloadAction<PlacesRequest>) {
      state.loading = true;
    },
    getPlacesSuccess(state: PlacesState, action: PayloadAction<PlaceResponse>) {
      if (state.offset > 0) {
        state.places = [...state.places, ...action.payload.data];
      } else {
        state.places = action.payload.data;
      }
      state.total = action.payload.total;
      state.loading = false;
    },
    getPlacesFailed(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    getPlaceById(state: PlacesState, action: PayloadAction<string>) {
      state.loading = true;
    },
    getPlaceByIdSuccess(state: PlacesState, action: PayloadAction<Place>) {
      state.loading = false;
      state.selectedPlace = action.payload;
    },
    getPlaceByIdFailed(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearPlaceByIdState(state: PlacesState) {
      state.selectedPlace = null;
    },
    createPlace(state: PlacesState, action: PayloadAction<PlaceRequest>) {
      state.loading = true;
    },
    createPlaceSuccess(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
    },
    createPlaceFailed(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    editPlace(state: PlacesState, action: PayloadAction<EditPlaceRequest>) {
      state.loading = true;
    },
    editPlaceSuccess(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
    },
    editPlaceFailed(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    deletePlace(state: PlacesState, action: PayloadAction<string>) {
      state.loading = true;
    },
    deletePlaceSuccess(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
    },
    deletePlaceFailed(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    getSubscriptions(state: PlacesState) {
      state.loading = false;
    },
    getSubscriptionsSuccess(state: PlacesState, action: PayloadAction<SubscriptionsResponse[]>) {
      state.loading = false;
      state.subscriptions = action.payload;
    },
    getSubscriptionsFailed(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    getReservationsByPlaceId(state: PlacesState, action: PayloadAction<GetReservationsRequest>) {
      state.loading = false;
    },
    getReservationsByPlaceIdSuccess(state: PlacesState, action: PayloadAction<GetReservationsResponse>) {
      state.loading = false;
      state.reservations = action.payload;
    },
    getReservationsByPlaceIdFailed(state: PlacesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    uploadSignedUrlImages: (state: PlacesState) => {
      state.signedUrlsLoading = true;
    },
    uploadSignedUrlImagesSuccess: (state: PlacesState) => {
      state.signedUrlsLoading = false;
    },
    uploadSignedUrlImagesError: (state: PlacesState, action: PayloadAction<any>) => {
      state.signedUrlsLoading = false;
      state.signedUrlsError = action.payload
    },
    updateOffset(state: PlacesState, action: PayloadAction<{ offset: number }>) {
      state.offset = action.payload.offset;
    },
    reset: (state) => {
      return initialState;
    },
  },
});

// Actions
export const placesActions = PlacesSlice.actions;

// Reducer
const placesReducer = PlacesSlice.reducer;
export default placesReducer;
