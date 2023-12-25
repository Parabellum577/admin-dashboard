import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Page, WhiteBox } from 'components';
import { FC, useEffect } from 'react';
import { citiesActions } from 'redux/reducers/cities';
import { allEnabledCitiesSelector } from 'redux/selectors/cities';
import CitiesTable from './citiesTable';

const Cities: FC = () => {
  const cities = useAppSelector(allEnabledCitiesSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(citiesActions.getEnabledCities());
  }, []);

  return (
    <Page title="Cities">
      <WhiteBox>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid rgb(247, 247, 255)"
          paddingBottom="20px"
        >
          <Typography variant="h2">Total: {cities.length}</Typography>
        </Stack>
        <CitiesTable />
      </WhiteBox>
    </Page>
  );
};

export default Cities;
