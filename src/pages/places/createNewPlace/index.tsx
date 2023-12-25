import { FC } from 'react';
import { Page, WhiteBox } from 'components';
import NewPlaceForm from '../components/placesForm';

const CreateNewPlace: FC = () => {
  return (
    <Page title="Create place">
      <WhiteBox>
        <NewPlaceForm placeId={undefined} />
      </WhiteBox>
    </Page>
  );
};

export default CreateNewPlace;
