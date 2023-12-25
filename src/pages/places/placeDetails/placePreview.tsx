import { FC, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { WhiteBox } from 'components';
import { Place } from 'types/places';
import { imagePlaceholder, locationIcon } from 'assets/svg';
import moment from 'moment';
import RichTextRenderer from 'components/common/ReachTextRenderer';

type Props = {
  place: Place | null;
};

const mb = 2;

const PlacePreview: FC<Props> = ({ place }) => {
  const formattedAvailability = useMemo(() => {
    const availability = place?.availability;
    if (!availability?.length) {
      return [];
    }
    if (availability?.length === 1) {
      return availability.map((day) => `Every ${day}`);
    }
    if (availability?.length > 1) {
      return availability.map((day) => moment(day, 'dddd').format('ddd'));
    }
  }, [place?.availability]);

  return (
    <WhiteBox width="50%">
      <Typography sx={{ marginBottom: '18px' }} variant="h2">
        Preview
      </Typography>
      <Stack marginBottom={mb}>
        <img
          src={place?.image || imagePlaceholder}
          alt="preview_image"
          className="preview-image"
        />
      </Stack>
      <Typography
        sx={{ fontWeight: 600, marginBottom: mb }}
        variant="body1"
        component="p"
      >
        {place?.name}
      </Typography>
      <Stack marginBottom={mb} flexDirection={'row'} alignItems={'center'}>
        {place ? (
          <Stack className="city-label">
            <Typography variant="body2" component="p" sx={{ color: '#FFFFFF' }}>
              {place?.city.name}
            </Typography>
          </Stack>
        ) : null}
        <Typography variant="body2" component="p">
          {formattedAvailability?.length
            ? formattedAvailability?.join(', ')
            : 'Access reservation disabled'}
        </Typography>
      </Stack>
      <Stack flexDirection={'row'} flexWrap={'wrap'}>
        {place?.tags.length
          ? place.tags.map((tag) => (
              <Stack className="tag" key={tag}>
                <Typography
                  variant="body2"
                  component="p"
                  sx={{ fontWeight: 600, fontSize: '12px' }}
                >
                  {tag}
                </Typography>
              </Stack>
            ))
          : null}
      </Stack>
      <RichTextRenderer html={place?.description || ''} sx={{ marginBottom: mb }} />
      <Stack flexDirection={'row'} alignItems={'center'} marginBottom={mb}>
        <img src={locationIcon} alt="location" className="location-icon" />
        <Typography sx={{ marginLeft: 1 }} variant="body2" component="p" width="80%">
          {place?.address}
        </Typography>
      </Stack>
    </WhiteBox>
  );
};

export default PlacePreview;
