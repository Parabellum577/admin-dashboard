import { FC, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Page, WhiteBox } from 'components';
import { useParams, useNavigate } from 'react-router-dom';
import { placeByIdSelector, subscriptionsSelector } from 'redux/selectors/places';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { placesActions } from 'redux/reducers/places';
import ConfirmationModal from 'components/confirmModal';
import Button from '@mui/material/Button';
import PlacePreview from './placePreview';
import PlaceDetailsInfo from './placeInfo';

type QueryParams = {
  placeId: string;
};
const PlaceDetails: FC = () => {
  const { placeId } = useParams<QueryParams>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const place = useAppSelector(placeByIdSelector);
  const subscriptions = useAppSelector(subscriptionsSelector);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!subscriptions.length) {
      dispatch(placesActions.getSubscriptions());
    }
  }, [dispatch, subscriptions]);

  useEffect(() => {
    if (placeId !== place?._id) {
      dispatch(placesActions.clearPlaceByIdState());
    }
  }, [dispatch, place?._id, placeId]);

  useEffect(() => {
    if (placeId) {
      dispatch(placesActions.getPlaceById(placeId));
    }
  }, [placeId, dispatch]);

  const handleModalOpen = (value: boolean) => {
    setModalOpen(value);
  };

  const handleDeletePlace = () => {
    if (place) {
      dispatch(placesActions.deletePlace(place?._id));
    }
    handleModalOpen(false);
  };

  return (
    <Page title={place?.name || ''}>
      <Stack flexDirection="row" width="100%">
        <PlacePreview place={place} />
        <Stack width="50%" flexDirection={'column'} marginLeft={3}>
        <WhiteBox>
            <PlaceDetailsInfo
              membersOnly={place?.membersOnly}
              type={place?.type}
              id={place?._id}
              code={place?.code}
            />
          </WhiteBox>
          <WhiteBox sx={{ marginTop: 3 }}>
            <Button
              sx={{ marginBottom: 2 }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate(`/places/edit/${place?._id}`)}
            >
              EDIT
            </Button>
            <Button
              onClick={() => handleModalOpen(true)}
              variant="outlined"
              color="error"
              fullWidth
            >
              DELETE
            </Button>
          </WhiteBox>
        </Stack>
      </Stack>
      <ConfirmationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={handleModalOpen}
        onSubmit={handleDeletePlace}
        okButtonText="Delete"
        message="Are you sure you want to delete this place?"
      />
    </Page>
  );
};

export default PlaceDetails;
