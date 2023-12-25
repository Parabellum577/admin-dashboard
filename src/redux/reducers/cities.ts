import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { City } from 'models/cities';
import {
  CityResponse,
  CitiesResponse,
  EnableCityRequest,
  DisableCityRequest,
  ChangeCityResponse,
  UpdateCityRequest,
} from 'types/cities';

export interface CitiesState {
  enabledCities: City[];
  allCities: City[];
  selectedCity: City | null;
  loading: boolean;
  error: any;
}

const initialState: CitiesState = {
  loading: false,
  enabledCities: [],
  selectedCity: null,
  allCities: [],
  error: null,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState: initialState,
  reducers: {
    getEnabledCities(state: CitiesState) {
      state.loading = true;
    },
    getEnabledCitiesSuccess(state: CitiesState, action: PayloadAction<CitiesResponse>) {
      state.loading = false;
      state.enabledCities = action.payload;
    },
    getEnabledCitiesFailed(state: CitiesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    getAllCities(state: CitiesState) {
      state.loading = true;
    },
    getAllCitiesSuccess(state: CitiesState, action: PayloadAction<CitiesResponse>) {
      state.loading = false;
      state.allCities = action.payload;
    },
    getAllCitiesFailed(state: CitiesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    getCityById(state: CitiesState, action: PayloadAction<string>) {
      state.loading = true;
    },
    getCityByIdSuccess(state: CitiesState, action: PayloadAction<CityResponse>) {
      state.loading = false;
      state.selectedCity = action.payload;
    },
    getCityByIdFailed(state: CitiesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    enableCity(state: CitiesState, action: PayloadAction<EnableCityRequest>) {
      state.loading = true;
    },
    enableCitySuccess(state: CitiesState, action: PayloadAction<ChangeCityResponse>) {
      state.loading = false;
    },
    enableCityFailed(state: CitiesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    editCity(state: CitiesState, action: PayloadAction<UpdateCityRequest>) {
      state.loading = true;
    },
    editCitySuccess(state: CitiesState, action: PayloadAction<any>) {
      state.loading = false;
    },
    editCityFailed(state: CitiesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    disableCity(state: CitiesState, action: PayloadAction<DisableCityRequest>) {
      state.loading = true;
    },
    disableCitySuccess(state: CitiesState, action: PayloadAction<ChangeCityResponse>) {
      state.loading = false;
    },
    disableCityFailed(state: CitiesState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelectedCity: (state: CitiesState) => {
      state.selectedCity = null;
    },
    reset: (state) => {
      return initialState;
    },
  },
});

// Actions
export const citiesActions = citiesSlice.actions;

// Reducer
const citiesReducer = citiesSlice.reducer;
export default citiesReducer;
