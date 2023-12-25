import { PayloadAction } from '@reduxjs/toolkit';
import citiesApi from 'api/cities';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { citiesActions } from 'redux/reducers/cities';
import {
  CitiesResponse,
  EnableCityRequest,
  DisableCityRequest,
  ChangeCityResponse,
  CityResponse,
  UpdateCityRequest,
} from 'types/cities';
import history from 'utils/route-history';

function* getEnabledCities() {
  try {
    const response: CitiesResponse = yield call(citiesApi.getEnabledCities);
    yield put(citiesActions.getEnabledCitiesSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch cities`, error);
    if (axios.isAxiosError(error)) {
      yield put(citiesActions.getEnabledCitiesFailed(error.response?.data.message));
    }
  }
}

function* getAllCities() {
  try {
    const response: CitiesResponse = yield call(citiesApi.getAllCities);
    yield put(citiesActions.getAllCitiesSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch cities`, error);
    if (axios.isAxiosError(error)) {
      yield put(citiesActions.getAllCitiesFailed(error.response?.data.message));
    }
  }
}

function* getCityById(data: PayloadAction<string>) {
  try {
    const response: CityResponse = yield call(citiesApi.getCityById, data.payload);
    yield put(citiesActions.getCityByIdSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch city by id`, error);
    if (axios.isAxiosError(error)) {
      yield put(citiesActions.getCityByIdFailed(error.response?.data.message));
    }
  }
}

function* updateEnabledCities() {
  try {
    const updatedCities: CitiesResponse = yield call(citiesActions.getEnabledCities);
    yield put(citiesActions.getEnabledCitiesSuccess(updatedCities));
  } catch (error) {
    console.log(`Failed to update cities list`, error);
  }
}

function* disableCity(data: PayloadAction<DisableCityRequest>) {
  try {
    const response: ChangeCityResponse = yield call(citiesApi.disableCity, data.payload);
    yield put(citiesActions.disableCitySuccess(response));
    yield call(updateEnabledCities);
    history.push('/cities/all-cities');
  } catch (error) {
    console.log(`Failed to disable city`, error);
    if (axios.isAxiosError(error)) {
      yield put(citiesActions.disableCityFailed(error.response?.data.message));
    }
  }
}

function* enableCity(data: PayloadAction<EnableCityRequest>) {
  try {
    const response: ChangeCityResponse = yield call(citiesApi.enableCity, data.payload);
    yield put(citiesActions.enableCitySuccess(response));
    yield call(updateEnabledCities);
    history.push('/cities/all-cities');
  } catch (error) {
    console.log(`Failed to enable city`, error);
    if (axios.isAxiosError(error)) {
      yield put(citiesActions.enableCityFailed(error.response?.data.message));
    }
  }
}

function* editCity(data: PayloadAction<UpdateCityRequest>) {
  try {
    const response: ChangeCityResponse = yield call(citiesApi.updateCity, data.payload);
    yield put(citiesActions.editCitySuccess(response));
    yield call(updateEnabledCities);
    history.push('/cities/all-cities');
  } catch (error) {
    console.log(`Failed to edit city`, error);
    if (axios.isAxiosError(error)) {
      yield put(citiesActions.editCityFailed(error.response?.data.message));
    }
  }
}

export default function* citiesSaga() {
  yield takeLatest(citiesActions.getEnabledCities.type, getEnabledCities);
  yield takeLatest(citiesActions.getAllCities.type, getAllCities);
  yield takeLatest(citiesActions.enableCity.type, enableCity);
  yield takeLatest(citiesActions.disableCity.type, disableCity);
  yield takeLatest(citiesActions.getCityById.type, getCityById);
  yield takeLatest(citiesActions.editCity.type, editCity);
}
