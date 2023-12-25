import { FC } from 'react';
import { Page, WhiteBox } from 'components';
import NewPlaceForm from '../components/placesForm';
import { useParams } from 'react-router-dom';

type QueryParams = {
  placeId: string;
};
const EditPlace: FC = () => {
  const { placeId } = useParams<QueryParams>();

  return (
    <Page title="Edit place">
      <WhiteBox>
        <NewPlaceForm placeId={placeId} />
      </WhiteBox>
    </Page>
  );
};

export default EditPlace;
