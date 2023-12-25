import React, { useState, useCallback, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProductsFilters from './productsFilters';
import { Page, WhiteBox } from 'components';
import { allProductsSelector, productsLoadingSelector, productsTotalSelector } from 'redux/selectors/products';
import { ProductType } from 'models/product';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { productsActions } from 'redux/reducers/products';
import ProductsTable from './productsTable';
import NewProductForm from './newProductForm';
import { useDidUpdateEffect } from 'utils/hooks';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(allProductsSelector);
  const loading = useAppSelector(productsLoadingSelector);
  const total = useAppSelector(productsTotalSelector);

  const [searchValue, setSearchValue] = useState('');
  const [editableProduct, setEditableProduct] = useState<ProductType | null>(null);
  const [offset, setOffset] = useState(0);

  const onSearchChange = useCallback((searchText: string) => {
    setSearchValue(searchText);
  }, []);

  const handleEditProduct = useCallback((product: typeof editableProduct) => {
    setEditableProduct(product);
  }, []);

  useEffect(() => {
    setOffset(0);
    dispatch(productsActions.getProducts({}));

    return () => {
      dispatch(productsActions.updateOffset({ offset: 0 }));
    };
  }, [dispatch]);

  useDidUpdateEffect(() => {
    setOffset(0);
    dispatch(
      productsActions.getProducts({
        query: searchValue,
        offset: 0,
      })
    );
  }, [searchValue]);

  const loadMore = () => {
    dispatch(
      productsActions.getProducts({
        query: searchValue,
        offset: offset + 10,
      })
    );
    setOffset(offset + 10);
  };

  useDidUpdateEffect(() => {
    dispatch(productsActions.updateOffset({ offset: offset }));
  }, [offset]);

  return (
    <Page title="Products">
      <Stack direction="row" marginTop={2}>
        <WhiteBox width="66%" height="fit-content">
          <Stack
            direction="row"
            justifyContent="space-between"
            borderBottom="1px solid rgb(247, 247, 255)"
            paddingBottom="20px"
          >
            <Typography variant="h2">Total: {total}</Typography>
            <ProductsFilters onSearchChange={onSearchChange} searchValue={searchValue} />
          </Stack>
          <ProductsTable
            total={total || 0}
            loading={loading}
            products={products || []}
            loadMore={loadMore}
            handleEditProduct={handleEditProduct}
            onDelete={(id: string) => dispatch(productsActions.deleteProduct({ id }))}
          />
        </WhiteBox>
        <WhiteBox width="33%" margin="0 0 0 16px" height="fit-content">
          <NewProductForm
            editableProduct={editableProduct}
            handleEditProduct={handleEditProduct}
          />
        </WhiteBox>
      </Stack>
    </Page>
  );
};

export default Products;
