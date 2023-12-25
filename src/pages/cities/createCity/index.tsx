import { FC } from 'react';
import { Page, WhiteBox } from 'components';
import NewCityForm from '../components/cityForm';

const CreateNewCity: FC = () => {
  return (
    <Page title="Enable city">
      <WhiteBox>
        <NewCityForm cityId={undefined} />
      </WhiteBox>
    </Page>
  );
};

export default CreateNewCity;
