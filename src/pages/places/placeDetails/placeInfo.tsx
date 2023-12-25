import { FC, useEffect, useCallback, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { placeByIdSelector, subscriptionsSelector } from 'redux/selectors/places';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { placesActions } from 'redux/reducers/places';
import MemberInfoLine from 'pages/memberships/memberProfile/memberInfoLine';
import { placeTypesOptions } from 'models/place';
import { CopyClickboardInput } from 'components';

type Props = {
  membersOnly: boolean | undefined;
  type: string | undefined;
  id: string | undefined;
  code: string | undefined;
};
const PlaceDetailsInfo: FC<Props> = ({ membersOnly, type, id, code }) => {
  const dispatch = useAppDispatch();
  const place = useAppSelector(placeByIdSelector);
  const subscriptions = useAppSelector(subscriptionsSelector);

  useEffect(() => {
    if (!subscriptions.length) {
      dispatch(placesActions.getSubscriptions());
    }
  }, [dispatch, subscriptions]);

  const getTypeName = useCallback((type: string) => {
    const currentType = placeTypesOptions.find((e) => e.value === type);
    return currentType?.label || '';
  }, []);

  const availableSubscriptions = useMemo(() => {
    if (!subscriptions.length || !place?.allowedSubscriptions.length) return;
    const res =
      subscriptions.filter((item) => place?.allowedSubscriptions.includes(item.id)) || [];
    return res.map((e) => e.name);
  }, [place?.allowedSubscriptions, subscriptions]);

  return (
    <Stack direction="column">
      <Typography sx={{ marginBottom: '18px' }} variant="h2">
        Information
      </Typography>
      <MemberInfoLine value={id || ''} label="ID" />
      <MemberInfoLine value={code || ''} label="Code" />
      <MemberInfoLine value={membersOnly ? 'Private' : 'Public'} label="Access" />
      <MemberInfoLine value={getTypeName(type || '')} label="Type" />
      <MemberInfoLine
        value={availableSubscriptions?.length ? availableSubscriptions.join(', ') : ''}
        label="Available Subscriptions"
      />
      <Stack flexDirection={'row'} alignItems={'center'}>
        <Typography sx={{ marginRight: '8px' }} variant="caption">
          Check-in link:
        </Typography>
        <CopyClickboardInput
          inputValue={`${
            process.env.REACT_APP_API_URL
          }/api/mobile/check-in/place-checkin-link?placeId=${id}${
            place?.code ? `&placeCode=${place.code}` : ''
          }&checkinRedirect=${process.env.REACT_APP_CHECK_IN_URL}`}
        />
      </Stack>
    </Stack>
  );
};

export default PlaceDetailsInfo;
