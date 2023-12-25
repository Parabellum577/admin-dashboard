import { useAppDispatch } from 'app/hooks';
import { Page, WhiteBox } from 'components';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { citiesActions } from 'redux/reducers/cities';
import NewCityForm from '../components/cityForm';

type QueryParams = {
  cityId: string;
};

const EditCity: FC = () => {
  const { cityId } = useParams<QueryParams>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(citiesActions.clearSelectedCity());
    };
  });

  return (
    <Page title="Edit city">
      <WhiteBox>
        <NewCityForm cityId={cityId} />
      </WhiteBox>
    </Page>
  );
};

export default EditCity;
