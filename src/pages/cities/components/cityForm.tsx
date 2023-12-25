import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { FileUploader, FormikInput, ReachTextArea, SearchSelect } from 'components';
import { isValidFile } from 'constans/files';
import { useFormik } from 'formik';
import { City } from 'models/cities';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { citiesActions } from 'redux/reducers/cities';
import { allCitiesSelector, cityByIdSelector } from 'redux/selectors/cities';
import { convertFileToBlob } from 'utils/helpers/filesHelper';
import * as yup from 'yup';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const validationSchema = yup.object().shape({
  city: yup.string().required('City required'),
  code: yup.string().required('Abbreviation required'),
  y5PdfUrl: yup.string(),
  localPerks: yup.string(),
});

type CityFormType = {
  city: string;
  code: string;
  y5PdfUrl: string | null;
  localPerks: string | null;
};

type ComponentProps = {
  cityId: string | undefined;
};

const CityForm: React.FC<ComponentProps> = ({ cityId }) => {
  const dispatch = useAppDispatch();
  const allCities = useAppSelector(allCitiesSelector);
  const editableCity = useAppSelector(cityByIdSelector);

  const [uploadedY5Pdf, setUploadedY5Pdf] = useState<File | null>(null);
  const [editY5PdfUrl, setEditY5PdfUrl] = useState<string | undefined>(undefined);

  const [y5PdfError, setY5PdfError] = useState<string | null>(null);
  const [y5PdfBlobUrl, setY5PdfBlobUrl] = useState<string | null>(null); // to hold the preview blob URL
  const [y5PdfPagesNum, setY5PdfPagesNum] = useState(0);

  const isEditModeActive = !!cityId;

  useEffect(() => {
    if (!allCities.length) {
      dispatch(citiesActions.getAllCities());
    }
  }, [dispatch, allCities]);

  useEffect(() => {
    if (cityId) {
      dispatch(citiesActions.getCityById(cityId));
    }

    return () => resetFormHandler();
  }, [cityId, dispatch]);

  useEffect(() => {
    if (cityId && editableCity) {
      setEditY5PdfUrl(editableCity.y5PdfUrl);
      setFormValues(editableCity);
    }
  }, [editableCity, cityId]);

  const handleSubmit = useCallback(
    async (values: CityFormType): Promise<void> => {
      const requestData = {
        code: values.code,
        y5PdfUrl: values.y5PdfUrl || undefined,
        localPerks: values.localPerks || undefined,
      };
      if (cityId) {
        dispatch(citiesActions.editCity({ data: requestData, id: cityId }));
      } else {
        dispatch(citiesActions.enableCity({ data: requestData, id: values.city }));
      }
    },
    [dispatch]
  );

  const disableCity = () => {
    if (cityId) {
      dispatch(citiesActions.disableCity({ id: cityId }));
    }
  };

  const formik = useFormik({
    initialValues: {
      city: '',
      code: '',
      y5PdfUrl: '',
      localPerks: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
  });

  const setFormValues = useCallback(
    (city: City) => {
      const { setValues } = formik;
      console.log(city);
      setValues({
        city: city._id,
        code: city.code ? city.code : '',
        y5PdfUrl: city.y5PdfUrl ? city.y5PdfUrl : '',
        localPerks: city.localPerks ? city.localPerks : '',
      });
    },
    [formik]
  );

  const resetFormHandler = () => {
    formik.resetForm();
    setUploadedY5Pdf(null);
    handleClearY5PdfUrl();
  };

  const citiesOptions = useMemo(
    () =>
      allCities.length
        ? allCities.map((city) => ({
            value: city?._id,
            label: city?.name,
          }))
        : [{ value: '', label: '' }],
    [allCities]
  );

  const handleUploadY5Pdf = async (file: File | null) => {
    setY5PdfError(null);

    if (file) {
      const isValidType = isValidFile(file?.name, 'pdf');
      const isValidSize = file.size <= 30000000;

      if (!isValidType) {
        setY5PdfError('Not a valid pdf file');
        return;
      }

      if (!isValidSize) {
        setY5PdfError('The file size should be less then 30 Mb');
        return;
      }

      const blob = await convertFileToBlob(file);

      setY5PdfBlobUrl(blob);
      setUploadedY5Pdf(file);
      formik.setFieldValue('y5PdfUrl', blob);
    } else {
      setY5PdfBlobUrl(null);
      setUploadedY5Pdf(null);
      setEditY5PdfUrl(editableCity?.y5PdfUrl);
      formik.setFieldValue('y5PdfUrl', editableCity?.y5PdfUrl);
    }
  };

  const handleClearY5PdfUrl = () => {
    formik.setFieldValue('y5PdfUrl', null);
    setEditY5PdfUrl(undefined);
  };

  return (
    <Stack component="form" onSubmit={formik.handleSubmit}>
      <Stack flexDirection="row">
        <Stack width="50%" marginRight={4} className="new-place-form">
          <SearchSelect
            name="city"
            label="City"
            disabled={isEditModeActive}
            options={citiesOptions}
            value={formik.values.city}
            onChange={(value: string) => formik.setFieldValue('city', value)}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
          <FormikInput formik={formik} name="code" label="Three-letter abbreviation" />

          <ReachTextArea
            placeholder="Local Perks"
            sx={{ marginBottom: '24px' }}
            value={formik.values.localPerks}
            onChange={(value) => formik.setFieldValue('localPerks', value)}
            hasError={formik.touched.localPerks && Boolean(formik.errors.localPerks)}
            errorText={formik.errors.localPerks}
          />
        </Stack>
        <Stack width="50%" className="new-place-form">
          {(y5PdfBlobUrl || editY5PdfUrl) && (
            <Stack
              flexDirection={'column'}
              sx={{
                width: '100%',
                maxHeight: '300px',
                overflow: 'hidden',
                borderRadius: '12px',
              }}
            >
              <Stack sx={{ overflowY: 'scroll' }}>
                <Document
                  file={y5PdfBlobUrl || editY5PdfUrl}
                  onLoadSuccess={(d) => setY5PdfPagesNum(d.numPages)}
                >
                  {Array.from({ length: y5PdfPagesNum }, (_, index) => (
                    <Page key={index + 1} pageNumber={index + 1} />
                  ))}
                </Document>
              </Stack>
            </Stack>
          )}
          <FileUploader
            label="UPLOAD Y5 PDF"
            onChange={(file) => handleUploadY5Pdf(file)}
            file={uploadedY5Pdf}
            selectedFile={editY5PdfUrl}
            clearFileName={handleClearY5PdfUrl}
            hasError={
              (formik.touched.y5PdfUrl && Boolean(formik.errors.y5PdfUrl)) ||
              Boolean(y5PdfError)
            }
            errorText={y5PdfError || formik.errors.y5PdfUrl}
          />
          <Stack marginTop={3}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              {isEditModeActive ? 'SAVE' : 'ENABLE'}
            </Button>
            {isEditModeActive && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                type="button"
                onClick={disableCity}
              >
                DISABLE
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CityForm;
