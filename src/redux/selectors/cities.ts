import { createSelector } from 'reselect';
import { RootState } from 'app/store';
import { CitiesState } from 'redux/reducers/cities';

export const citiesSelector = (state: RootState): CitiesState => state.cities;

export const allEnabledCitiesSelector = createSelector(
  citiesSelector,
  (cities) => cities.enabledCities
);

export const allCitiesSelector = createSelector(
  citiesSelector,
  (cities) => cities.allCities
);

export const cityByIdSelector = createSelector(
  citiesSelector,
  (city) => city.selectedCity
);

export const citiesLoadingSelector = createSelector(
  citiesSelector,
  (cities) => cities.loading
);

export const citiesErrorSelector = createSelector(
  citiesSelector,
  (cities) => cities.error
);
