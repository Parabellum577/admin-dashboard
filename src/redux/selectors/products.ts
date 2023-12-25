import { createSelector } from 'reselect';
import { RootState } from 'app/store';
import { ProductsState } from 'redux/reducers/products';

export const productsSelector = (state: RootState): ProductsState => state.products;

export const allProductsSelector = createSelector(
  productsSelector,
  (products) => products.products
);

export const productsLoadingSelector = createSelector(
  productsSelector,
  (products) => products.loading
);

export const productsErrorSelector = createSelector(
  productsSelector,
  (products) => products.error
);

export const productsTotalSelector = createSelector(
  productsSelector,
  (products) => products.total
);
