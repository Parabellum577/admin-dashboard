import { FC, useState, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Page, WhiteBox } from 'components';
import PlacesTable from './placesTable';
import { totalPacesSelector, allPacesSelector } from 'redux/selectors/places';
import PlacesFilters from './placesFilters';
import { placesActions } from 'redux/reducers/places';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useDidUpdateEffect } from 'utils/hooks';

const Places: FC = () => {
  const places = useAppSelector(allPacesSelector);
  const total = useAppSelector(totalPacesSelector);
  const [searchValue, setSearchValue] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [offset, setOffset] = useState(0);
  const dispatch = useAppDispatch();
  const type = useMemo(
    () => (selectedType === 'All' ? '' : selectedType),
    [selectedType]
  );

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onTypeSelect = (value: string) => {
    setSelectedType(value);
  };

  useEffect(() => {
    setOffset(0);
    dispatch(
      placesActions.getPlaces({
        query: searchValue,
        offset: 0,
        type,
      })
    );

    return () => {
      dispatch(placesActions.updateOffset({ offset: 0 }));
    };
  }, [dispatch]);

  useDidUpdateEffect(() => {
    setOffset(0);
    dispatch(
      placesActions.getPlaces({
        query: searchValue,
        offset: 0,
        type,
      })
    );
  }, [searchValue, selectedType]);

  const loadMore = () => {
    dispatch(
      placesActions.getPlaces({
        query: searchValue,
        offset: offset + 10,
        type,
      })
    );
    setOffset(offset + 10);
  };

  useDidUpdateEffect(() => {
    dispatch(placesActions.updateOffset({ offset: offset }));
  }, [offset]);

  return (
    <Page title="Places">
      <WhiteBox>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid rgb(247, 247, 255)"
          paddingBottom="20px"
        >
          <Typography variant="h2">Total: {total}</Typography>
          <PlacesFilters
            searchValue={searchValue}
            onSearchChange={onSearch}
            selectedType={selectedType}
            onTypeSelect={onTypeSelect}
          />
        </Stack>
        <PlacesTable />
        {total && places?.length < total ? (
          <Button onClick={loadMore} variant="contained" color="primary" fullWidth>
            Load more
          </Button>
        ) : null}
      </WhiteBox>
    </Page>
  );
};

export default Places;
