import { PayloadAction } from '@reduxjs/toolkit';
import placesApi from 'api/places';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { placesActions } from 'redux/reducers/places';
import {
  PlaceRequest,
  PlaceResponse,
  EditPlaceRequest,
  GetReservationsRequest,
  GetReservationsResponse,
  PlacesRequest,
  Place
} from 'types/places';
import { SubscriptionsResponse } from 'types/subscriptions';
import { appActions } from 'redux/reducers/app';
import history from 'utils/route-history';

function* getPlaces(data: PayloadAction<PlacesRequest>) {
  try {
    const response: PlaceResponse = yield call(placesApi.getPlaces, data.payload);
    yield put(placesActions.getPlacesSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch places`, error);
    if (axios.isAxiosError(error)) {
      yield put(placesActions.getPlacesFailed(error.response?.data.message));
    }
  }
}

function* updatePlacesList() {
  try {
    yield put(placesActions.getPlaces({}));
  } catch (error) {
    console.log(`Failed to update places list`, error);
  }
};

function* createPlace(data: PayloadAction<PlaceRequest>) {
  try {
    const response: Place[] = yield call(placesApi.createPlace, data.payload);
    yield put(placesActions.createPlaceSuccess(response));
    yield put(appActions.setToast({
      open: true,
      message: 'Place was successfully created!',
      severity: 'success',
    }))
    yield call(updatePlacesList)
    history.push('/places/all-places');
  } catch (error) {
    console.log(`Failed to create place`, error);
    if (axios.isAxiosError(error)) {
      yield put(placesActions.createPlaceFailed(error.response?.data.message));
      yield put(appActions.setToast({
        open: true,
        message: error.response?.data.message,
        severity: 'error',
      }));
    }
  }
}

function* getPlaceById(data: PayloadAction<string>) {
  try {
    const response: Place = yield call(placesApi.getPlaceById, data.payload);
    yield put(placesActions.getPlaceByIdSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch place by id`, error);
    if (axios.isAxiosError(error)) {
      yield put(placesActions.getPlaceByIdFailed(error.response?.data.message));
    }
  }
}

function* deletePlace(data: PayloadAction<string>) {
  try {
    const response: Place = yield call(placesApi.deletePlace, data.payload);
    yield put(placesActions.deletePlaceSuccess(response));
    yield put(appActions.setToast({
      open: true,
      message: 'Place successfully deleted!',
      severity: 'success',
    }));
    yield call(updatePlacesList)
    history.push('/places/all-places');
  } catch (error) {
    console.log(`Failed to delete place`, error);
    if (axios.isAxiosError(error)) {
      yield put(placesActions.deletePlaceFailed(error.response?.data.message));
      yield put(appActions.setToast({
        open: true,
        message: error?.response?.data.message,
        severity: 'error',
      }));
    }
  }
}

function* editPlace(data: PayloadAction<EditPlaceRequest>) {
  try {
    const response: Place = yield call(placesApi.editPlace, data.payload);
    yield put(placesActions.editPlaceSuccess(response));
    yield put(appActions.setToast({
      open: true,
      message: 'Place successfully edited!',
      severity: 'success',
    }));
    yield call(updatePlacesList);
    history.push(`/places/details/${response._id}`);
  } catch (error) {
    console.log(`Failed to edit place`, error);
    if (axios.isAxiosError(error)) {
      yield put(placesActions.editPlaceFailed(error.response?.data.message));
      yield put(appActions.setToast({
        open: true,
        message: error.response?.data.message,
        severity: 'error',
      }));
    }
  }
}

function* getSubscriptions() {
  try {
    const response: SubscriptionsResponse[] = yield call(placesApi.getSubscriptions);
    yield put(placesActions.getSubscriptionsSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch subscriptions`, error);
    if (axios.isAxiosError(error)) {
      yield put(placesActions.getSubscriptionsFailed(error.response?.data.message));
    }
  }
}

function* getReservationsByPlaceId(data: PayloadAction<GetReservationsRequest>) {
  try {
    const response: GetReservationsResponse = yield call(placesApi.getReservationsByPlaceId, data.payload);
    yield put(placesActions.getReservationsByPlaceIdSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch reservation for place id=${data.payload.placeId}`, error);
    if (axios.isAxiosError(error)) {
      yield put(placesActions.getReservationsByPlaceIdFailed(error.response?.data.message));
    }
  }
}

export default function* placesSaga() {
  yield takeLatest(placesActions.createPlace.type, createPlace);
  yield takeLatest(placesActions.getPlaces.type, getPlaces);
  yield takeLatest(placesActions.getPlaceById.type, getPlaceById);
  yield takeLatest(placesActions.deletePlace.type, deletePlace);
  yield takeLatest(placesActions.editPlace.type, editPlace);
  yield takeLatest(placesActions.getSubscriptions.type, getSubscriptions);
  yield takeLatest(placesActions.getReservationsByPlaceId.type, getReservationsByPlaceId);
}
