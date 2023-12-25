import { createSelector } from 'reselect';
import { RootState } from 'app/store';
import { PlacesState } from 'redux/reducers/places';

export const placesSelector = (state: RootState): PlacesState => state.places;

export const allPacesSelector = createSelector(
  placesSelector,
  (places) => places.places
);

export const totalPacesSelector = createSelector(
  placesSelector,
  (places) => places.total
);

export const placeByIdSelector = createSelector(
  placesSelector,
  (places) => places.selectedPlace
);

export const subscriptionsSelector = createSelector(
  placesSelector,
  (places) => places.subscriptions
);

export const placeLoadingSelector = createSelector(
  placesSelector,
  (places) => places.loading
);

export const placeReservationsSelector = createSelector(
  placesSelector,
  (places) => places.reservations
);

export const placeSignedUrlsLoadingSelector = createSelector(
  placesSelector,
  (places) => places.signedUrlsLoading
);

export const placeSignedUrlsErrorSelector = createSelector(
  placesSelector,
  (places) => places.error
);