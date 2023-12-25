import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductType } from 'models/product';
import { GetProductsResponse, GetProductsRequest, CreateProductRequest, CreateProductResponse, EditProductRequest, DeleteProductRequest } from 'types/products';

export interface ProductsState {
  loading: boolean;
  products: ProductType[];
  error: any;
  total: number | null;
  offset: number;
};

const initialState: ProductsState = {
  loading: false,
  products: [],
  error: null,
  total: null,
  offset: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {
    getProducts(state: ProductsState, action: PayloadAction<GetProductsRequest>) {
      state.loading = true;
    },
    getProductsSuccess(state: ProductsState, action: PayloadAction<GetProductsResponse>) {
      state.loading = false;
      state.total = action.payload.total;
      if (state.offset > 0) {
        state.products = [...state.products, ...action.payload.data];
      } else {
        state.products = action.payload.data;
      }
    },
    getProductsFailed(state: ProductsState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    createProduct(state: ProductsState, action: PayloadAction<CreateProductRequest>) {
      state.loading = true;
    },
    createProductSuccess(state: ProductsState, action: PayloadAction<CreateProductResponse>) {
      state.loading = false;
    },
    createProductFailed(state: ProductsState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    editProduct(state: ProductsState, action: PayloadAction<EditProductRequest>) {
      state.loading = true;
    },
    editProductSuccess(state: ProductsState, action: PayloadAction<CreateProductResponse>) {
      state.loading = false;
    },
    editProductFailed(state: ProductsState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProduct(state: ProductsState, action: PayloadAction<DeleteProductRequest>) {
      state.loading = true;
    },
    deleteProductSuccess(state: ProductsState, action: PayloadAction<CreateProductResponse>) {
      state.loading = false;
    },
    deleteProductFailed(state: ProductsState, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateOffset(state: ProductsState, action: PayloadAction<{ offset: number }>) {
      state.offset = action.payload.offset;
    },
    reset: (state) => {
      return initialState;
    },
  },
});

// Actions
export const productsActions = productsSlice.actions;

// Reducer
const productsReducer = productsSlice.reducer;
export default productsReducer;
