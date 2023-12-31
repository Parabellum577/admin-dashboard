import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { combineReducers } from 'redux';
import authReducer from 'redux/reducers/auth';
import placesReducer from 'redux/reducers/places';
import usersReducer from 'redux/reducers/users';
import productsReducer from 'redux/reducers/products';
import partnersReducer from 'redux/reducers/partners';
import experiencesReducer from 'redux/reducers/experiences';
import checkInReducer from 'redux/reducers/checkIn';
import citiesReducer from 'redux/reducers/cities';
import paymentsReducer from 'redux/reducers/payments';
import appReducer from 'redux/reducers/app';
import analyticsReducer from 'redux/reducers/analytics';
import hotspotsReducer from 'redux/reducers/hotspots';
import announcementsReducer from 'redux/reducers/announcements';
import rootSaga from './rootSaga';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  places: placesReducer,
  users: usersReducer,
  products: productsReducer,
  partners: partnersReducer,
  checkin: checkInReducer,
  experiences: experiencesReducer,
  cities: citiesReducer,
  payments: paymentsReducer,
  analytics: analyticsReducer,
  hotspots: hotspotsReducer,
  announcements: announcementsReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
