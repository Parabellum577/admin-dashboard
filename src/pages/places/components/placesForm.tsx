import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { citiesActions } from 'redux/reducers/cities';
import { placesActions } from 'redux/reducers/places';
import {
  placeByIdSelector,
  placeSignedUrlsLoadingSelector,
} from 'redux/selectors/places';
import { appActions } from 'redux/reducers/app';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { allEnabledCitiesSelector } from 'redux/selectors/cities';
import { subscriptionsSelector } from 'redux/selectors/places';
import { Place } from 'types/places';
import { SignedUrlResponse } from 'types/places';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { placeTagsOptions, placeTypesOptions, DaysOfWeekEnum } from 'models/place';
import {
  CustomSelect,
  FileMultiUploader,
  FormikInput,
  GoogleAutocompleteInput,
  ReachTextArea,
  TagsSelector,
} from 'components';
import {
  useUploadImagesToS3Bucket,
  useCreateSignedUrls,
} from 'utils/helpers/hooks/useUploadImagesToS3Bucket';
import { isValidFileType } from 'constans/files';

const validationSchema = yup.object().shape({
  description: yup.string().required('Description required'),
  placeName: yup.string().required('Place required'),
  address: yup.string().required('Address required'),
  city: yup.string().required('City required'),
  type: yup.string().required('Type required'),
  image: yup.string().required('Place image is required'),
  photos: yup.array().of(yup.string()),
  tags: yup.array().of(yup.string()),
  isReservationEnabled: yup.boolean(),
  id: yup.string(),
  allowedSubscriptions: yup
    .array()
    .of(yup.string())
    .min(1, 'Subscriptions required')
    .when('type', {
      is: 'venue',
      then: () => yup.array().of(yup.string()),
    }),
  accessDetails: yup
    .string()
    .required('Access Details required')
    .when('type', {
      is: 'venue',
      then: () => yup.string(),
    }),
  availability: yup
    .array()
    .of(yup.string())
    .when('isReservationEnabled', {
      is: true,
      then: () => yup.array().of(yup.string()).min(1, 'Availability required'),
    }),
});

type PlacesForm = {
  allowedSubscriptions: string[];
  accessDetails: string;
  description: string;
  placeName: string;
  address: string;
  city: string;
  type: string;
  tags: string[];
  id: string;
  isReservationEnabled: boolean;
  image: string | null;
  photos: string[];
  availability: string[];
};

type ComponentProps = {
  placeId: string | undefined;
};

const NewPlaceForm: React.FC<ComponentProps> = ({ placeId }) => {
  // hooks
  const dispatch = useAppDispatch();
  const { uploadImagesToS3Bucket } = useUploadImagesToS3Bucket();
  const { getSignedUrls } = useCreateSignedUrls();
  // selectors
  const cities = useAppSelector(allEnabledCitiesSelector);
  const isImagesLoading = useAppSelector(placeSignedUrlsLoadingSelector);
  const editablePlace = useAppSelector(placeByIdSelector);
  const subscriptions = useAppSelector(subscriptionsSelector);
  // state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [editImagesUrls, setEditImagesUrls] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [defaultImageIndex, setDefaultImageIndex] = useState(0);
  const [signedUrls, setSignedUrls] = useState<SignedUrlResponse[]>([]);

  useEffect(() => {
    if (placeId) {
      dispatch(placesActions.getPlaceById(placeId));
    }
  }, [placeId, dispatch]);

  const isEditModeActive = useMemo(() => Boolean(placeId), [placeId]);

  const resetFormHandler = () => {
    formik.resetForm();
    setUploadedFiles([]);
    handleClearImageUrl();
  };

  const handleSubmit = useCallback(
    async (values: PlacesForm): Promise<void> => {
      try {
        const requestData = {
          membersOnly: Boolean(values.accessDetails === 'true'),
          allowedSubscriptions: values.allowedSubscriptions,
          description: values.description,
          address: values.address,
          name: values.placeName,
          type: values.type,
          city: values.city,
          tags: values.tags,
          image: values.image,
          photos: values.photos,
          isReservationEnabled: values.isReservationEnabled,
          availability: availability,
        };

        // if signed urls created successfully then upload all image to S3 bucket
        if (signedUrls.length) {
          await uploadImagesToS3Bucket(uploadedFiles, signedUrls);
        }
        // if values has id property, then edit the form
        if (values.id) {
          dispatch(
            placesActions.editPlace({
              data: requestData,
              id: values.id,
            })
          );
          resetFormHandler();
        } else {
          // if values has not id property, then create the new place
          dispatch(placesActions.createPlace(requestData));
          formik.resetForm();
          setUploadedFiles([]);
        }
      } catch (error) {
        dispatch(
          appActions.setToast({
            open: true,
            message: `Failed to create ${values.placeName}. Please try again later.`,
            severity: 'error',
          })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      availability,
      signedUrls,
      uploadedFiles,
      uploadImagesToS3Bucket,
      dispatch,
      resetFormHandler,
    ]
  );

  const formik = useFormik({
    initialValues: {
      allowedSubscriptions: [] as string[],
      accessDetails: '',
      isReservationEnabled: false,
      description: '',
      placeName: '',
      address: '',
      type: '',
      city: '',
      tags: [] as string[],
      id: '',
      image: '',
      photos: [] as string[],
      availability: [] as string[],
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
  });

  const setFormValues = useCallback(
    (place: Place) => {
      const { setValues } = formik;
      setEditImagesUrls([place.image, ...place.photos]);
      setAvailability(place.availability);
      setValues({
        allowedSubscriptions: place.allowedSubscriptions,
        accessDetails: place.membersOnly.toString(),
        description: place.description,
        placeName: place.name,
        address: place.address,
        city: place.city._id,
        type: place.type,
        tags: place.tags,
        id: place._id,
        isReservationEnabled: place.isReservationEnabled,
        image: place.image,
        photos: place.photos,
        availability: place.availability,
      });
    },
    [formik]
  );

  const setFormikImages = useCallback(
    (preselectedImages: string[], uploadedImages: SignedUrlResponse[], defaultImgIndex: number) => {
      // join arrays to get default image by selected index
      const combineImagesUrls = [
        ...preselectedImages,
        ...uploadedImages.map((el) => el.fileLocation),
      ];
      const photos = combineImagesUrls.filter((_, idx) => idx !== defaultImgIndex);
      formik.setFieldValue('image', combineImagesUrls[defaultImgIndex]);
      formik.setFieldValue('photos', photos);
    },
    [formik]
  );

  const handleUploadImage = async (files: File[]) => {
    setFileError(null);

    if (files && files.length) {
      const isValidFiles = files.every((file) => {
        const isValidType = isValidFileType(file.name, 'image');
        const isValidSize = file.size <= 20000000;
        return isValidType && isValidSize;
      });

      if (!isValidFiles) {
        setFileError('One or more selected files are not valid');
        return;
      }
      // if all files are valid, then create signed urls for all images
      const result = await getSignedUrls(files);

      if (!result) {
        // If the images could not be loaded correctly, then clear the loader
        setUploadedFiles([]);
      } else {
        setUploadedFiles(files);
        setSignedUrls(result.signedUrls);
        setFormikImages(editImagesUrls, result.signedUrls, defaultImageIndex);
      }
    } else {
      setUploadedFiles([]);
    }
  };

  const handleChangePreselectedImages = useCallback(
    (updatedImages: string[]) => {
      setEditImagesUrls(updatedImages);
      setFormikImages(updatedImages, signedUrls, defaultImageIndex);

      if (!updatedImages.length && !uploadedFiles.length) {
        setFileError('Place must have at least one image');
        return;
      }
    },
    [defaultImageIndex, setFormikImages, signedUrls, uploadedFiles.length]
  );

  const handleChangeDefaultImage = (index: number) => {
    setDefaultImageIndex(index);
    if (placeId) {
      // if edit mode enabled - join editImagesUrls & signedUrls arrays
      // and set default image & other photos by index
      setFormikImages(editImagesUrls, signedUrls, index);
    }
  };

  useEffect(() => {
    if (!cities.length) {
      dispatch(citiesActions.getEnabledCities());
    }
  }, [dispatch, cities]);

  useEffect(() => {
    if (!subscriptions.length) {
      dispatch(placesActions.getSubscriptions());
    }
  }, [dispatch, subscriptions]);

  const citiesOptions = useMemo(
    () =>
      cities.length
        ? cities.map((city) => ({
            value: city?._id,
            label: city?.name,
          }))
        : [{ value: '', label: '' }],
    [cities]
  );

  const subscriptionOptions = useMemo(
    () =>
      subscriptions.length
        ? subscriptions.map((subscription) => ({
            value: subscription.id,
            label: subscription.name,
          }))
        : [{ value: '', label: '' }],
    [subscriptions]
  );

  useEffect(() => {
    if (placeId && editablePlace) {
      setFormValues(editablePlace);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editablePlace, placeId]);

  const handleAvailability = (day: string) => {
    const isExist = availability.find((d) => d === day);
    if (isExist) {
      const days = availability.filter((d) => d !== day);
      setAvailability(days);
      formik.setFieldValue('availability', days);
    } else {
      formik.setFieldValue('availability', [...availability, day]);
      setAvailability([...availability, day]);
    }
  };

  const isActiveDay = (day: string) => {
    return availability.includes(day);
  };

  const handleClearImageUrl = () => {
    formik.setFieldValue('image', null);
    formik.setFieldValue('photos', null);
    setEditImagesUrls([]);
  };

  return (
    <Stack component="form" onSubmit={formik.handleSubmit}>
      <Stack flexDirection="row">
        <Stack width="50%" className="new-place-form" marginRight={4}>
          <CustomSelect
            name="city"
            label="City"
            options={citiesOptions}
            value={formik.values.city}
            onChange={formik.handleChange}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
          <FormikInput name="placeName" label="Name of place" formik={formik} />
          <GoogleAutocompleteInput
            name="address"
            label="Address"
            value={formik.values.address}
            onChange={(value: string) => formik.setFieldValue('address', value)}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
          <CustomSelect
            name="type"
            label="Type"
            options={placeTypesOptions}
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
          />
          <ReachTextArea
            placeholder="Description"
            value={formik.values.description}
            onChange={(value) => formik.setFieldValue('description', value)}
            hasError={formik.touched.description && Boolean(formik.errors.description)}
            errorText={formik.errors.description}
          />
        </Stack>
        <Stack width="50%" className="new-place-form">
          {formik.values.type !== 'venue' ? (
            <>
              <CustomSelect
                name="accessDetails"
                label="Access details"
                options={[
                  { value: 'false', label: 'Public' },
                  { value: 'true', label: 'Private' },
                ]}
                value={formik.values.accessDetails}
                onChange={formik.handleChange}
                error={
                  formik.touched.accessDetails && Boolean(formik.errors.accessDetails)
                }
                helperText={formik.touched.accessDetails && formik.errors.accessDetails}
              />
              <TagsSelector
                name="allowedSubscriptions"
                label="Subscriptions"
                options={subscriptionOptions}
                formik={formik}
              />
            </>
          ) : null}
          <TagsSelector
            name="tags"
            label="Tags"
            options={placeTagsOptions}
            formik={formik}
          />
          <Box>
            {formik.values.type !== 'venue' ? (
              <FormControlLabel
                control={
                  <Checkbox
                    name="isReservationEnabled"
                    color="info"
                    onChange={formik.handleChange}
                    value={formik.values.isReservationEnabled}
                    checked={formik.values.isReservationEnabled}
                  />
                }
                label="Enable access reservation in app"
              />
            ) : null}
            {formik.values.isReservationEnabled ? (
              <div>
                <div className="place-availability">
                  {Object.values(DaysOfWeekEnum).map((day) => {
                    return (
                      <Button
                        className={`${isActiveDay(day) ? 'active' : ''}`}
                        variant="rounded"
                        onClick={() => handleAvailability(day)}
                        key={day}
                      >
                        {day.substring(0, 3)}
                      </Button>
                    );
                  })}
                </div>
                {formik.touched.availability && Boolean(formik.errors.availability) ? (
                  <Typography color="error" variant="caption" sx={{ display: 'flex' }}>
                    {formik.errors.availability}
                  </Typography>
                ) : null}
              </div>
            ) : null}
          </Box>
        </Stack>
      </Stack>
      <FileMultiUploader
        label="UPLOAD IMAGE"
        onChange={(files) => handleUploadImage(files)}
        files={uploadedFiles}
        preSelectedImageUrls={editImagesUrls}
        handleChangePreselectedImages={handleChangePreselectedImages}
        handleSetDefaultImage={handleChangeDefaultImage}
        defaultImageIndex={defaultImageIndex}
        hasError={
          (formik.touched.image && Boolean(formik.errors.image)) || Boolean(fileError)
        }
        errorText={fileError || formik.errors.image}
      />
      <Stack marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={!!isImagesLoading}
        >
          {isEditModeActive ? 'SAVE' : 'SUBMIT'}
        </Button>
      </Stack>
    </Stack>
  );
};

export default NewPlaceForm;
