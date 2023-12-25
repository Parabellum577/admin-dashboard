import React, { useCallback, useEffect, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { CustomSelect, FormikInput } from 'components';
import { productsActions } from 'redux/reducers/products';
import { ProductType } from 'models/product';
import { placesActions } from 'redux/reducers/places';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { appPlacesSelector } from 'redux/selectors/app';
import { productTypeOptions } from 'models/product';
import { appActions } from 'redux/reducers/app';

const validationSchema = yup.object().shape({
  name: yup.string().required('Product Name required'),
  description: yup.string().required('Description required'),
  place: yup.string().required('Place required'),
  type: yup.string().required('Type required'),
  price: yup.number().min(1).required('Price required'),
  id: yup.string(),
});

type ProductForm = {
  name: string;
  description: string;
  type: string;
  price: number;
  link: string;
  place: string;
  id: string;
};

type ComponentProps = {
  editableProduct: ProductType | null;
  handleEditProduct: (product: ProductType | null) => void;
};

const NewProductForm: React.FC<ComponentProps> = ({
  editableProduct,
  handleEditProduct,
}) => {
  const dispatch = useAppDispatch();
  const isEditModeActive = useMemo(() => Boolean(editableProduct), [editableProduct]);
  const places = useAppSelector(appPlacesSelector);

  useEffect(() => {
    if (!places.length) {
      dispatch(appActions.getAllPlaces());
    }
  }, [dispatch, places]);

  const handleSubmit = useCallback(
    (values: ProductForm): void => {
      const requestData = {
        name: values.name,
        description: values.description,
        type: values.type,
        place: values.place,
        price: values.price * 100,
        link: values.link || '',
      };
      if (values.id) {
        dispatch(
          productsActions.editProduct({
            data: requestData,
            id: values.id,
          })
        );
        resetFormHandler();
      } else {
        dispatch(productsActions.createProduct(requestData));
        formik.resetForm();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const placesOptions = useMemo(
    () =>
      places.length
        ? places.map((place) => ({
            value: place?._id,
            label: place?.name,
          }))
        : [{ value: '', label: '' }],
    [places]
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      type: '',
      place: '',
      price: 0,
      link: '',
      id: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
  });

  const setFormValues = useCallback(
    (product: ProductType) => {
      const { setValues } = formik;
      const price = product?.pricing?.public?.price / 100 || 0;
      setValues({
        name: product.name,
        description: product.description,
        type: product.type,
        price: price,
        place: product.place._id,
        link: product.link || '',
        id: product._id,
      });
    },
    [formik]
  );

  useEffect(() => {
    if (editableProduct) {
      setFormValues(editableProduct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editableProduct]);

  const resetFormHandler = () => {
    handleEditProduct(null);
    formik.resetForm();
  };

  return (
    <Stack component="form" onSubmit={formik.handleSubmit} className="new-place-form">
      <Typography
        sx={{ fontWeight: '600' }}
        className="form-title"
        variant="body1"
        component="p"
      >
        {isEditModeActive ? 'Edit Product' : 'New Product'}
      </Typography>
      <FormikInput name="name" label="Product Name" formik={formik} />
      <FormikInput
        formik={formik}
        name="description"
        label="Description"
        rowsCount={3}
        multiline
      />
      <Stack direction="row" className="double-input-form">
        <CustomSelect
          className="margin-r-10"
          name="place"
          label="Place"
          options={placesOptions}
          value={formik.values.place}
          onChange={formik.handleChange}
          error={formik.touched.place && Boolean(formik.errors.place)}
          helperText={formik.touched.place && formik.errors.place}
        />
        <CustomSelect
          name="type"
          label="Type"
          options={productTypeOptions}
          value={formik.values.type}
          onChange={formik.handleChange}
          error={formik.touched.type && Boolean(formik.errors.type)}
          helperText={formik.touched.type && formik.errors.type}
        />
      </Stack>
      <FormikInput name="price" label="Price" type="number" formik={formik} />
      {isEditModeActive && (
        <FormikInput
          name="link"
          label="Link"
          inputProps={{ readOnly: true }}
          formik={formik}
        />
      )}
      <Stack marginBottom={3}>
        {isEditModeActive ? (
          <Stack>
            {editableProduct?.qrCode && (
              <Stack component="img" src={editableProduct.qrCode} alt="QR code" />
            )}
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={resetFormHandler}
            >
              CANCEL
            </Button>
          </Stack>
        ) : null}
      </Stack>
      <Button variant="contained" color="primary" fullWidth type="submit">
        {isEditModeActive ? 'SAVE' : 'SUBMIT'}
      </Button>
    </Stack>
  );
};

export default NewProductForm;
