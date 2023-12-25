import React, { useMemo, FC, useRef, ChangeEvent, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { closeIcon } from 'assets/svg';
import { appActions } from 'redux/reducers/app';
import { useAppDispatch } from 'app/hooks';
import { useAppSelector } from 'app/hooks';
import { placeSignedUrlsLoadingSelector } from 'redux/selectors/places';
import { ReactLoader } from 'components';

type Props = {
  onChange: (files: File[]) => void;
  handleChangePreselectedImages: (images: string[]) => void;
  handleSetDefaultImage: (idx: number) => void;
  defaultImageIndex: number;
  label: string;
  files: File[] | null;
  maxFilesCount?: number;
  preSelectedImageUrls?: string[];
  variant?: 'text' | 'contained' | 'outlined' | undefined;
  hasError?: boolean;
  errorText?: string;
  color?:
    | 'inherit'
    | 'error'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'custom'
    | undefined;
};

const FileMultiUploader: FC<Props> = ({
  onChange,
  label,
  variant = 'contained',
  color = 'secondary',
  hasError,
  errorText,
  files,
  handleSetDefaultImage,
  defaultImageIndex,
  preSelectedImageUrls,
  handleChangePreselectedImages,
  maxFilesCount = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(placeSignedUrlsLoadingSelector);

  useEffect(() => {
    if (!files?.length && fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  }, [files]);

  const handleUploadClick = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };

  const filesPreview = useMemo(() => {
    const uploadedFiles = files?.map((file) => window.URL.createObjectURL(file)) || [];
    const preselectedFiles = preSelectedImageUrls || [];

    if (preselectedFiles.length || uploadedFiles.length) {
      return [...preselectedFiles, ...uploadedFiles];
    } else {
      return [];
    }
  }, [files, preSelectedImageUrls]);

  const handleFileChange = (event: ChangeEvent<any>) => {
    const fileList: File[] = Array.from(event.target.files);
    const totalImagesCount = fileList.length + (filesPreview?.length || 0);

    if (totalImagesCount <= maxFilesCount) {
      onChange([...(files || []), ...fileList]);
    } else {
      dispatch(
        appActions.setToast({
          open: true,
          message: `You can upload a maximum ${maxFilesCount} files!`,
          severity: 'error',
        })
      );
    }
  };

  const handleFileRemove = (
    e: React.MouseEvent<HTMLImageElement | HTMLDivElement, MouseEvent>,
    type: 'file' | 'url',
    imageSource: string,
    indexFromGeneralArray: number
  ) => {
    e.stopPropagation();
    if (type === 'url') {
      const updatedImages =
        preSelectedImageUrls?.filter((imageUrl) => imageUrl !== imageSource) || [];
      handleChangePreselectedImages(updatedImages);
    } else {
      const currentFileIndex =
        indexFromGeneralArray - (preSelectedImageUrls?.length || 0);
      const updatedFiles = files?.filter((_, idx) => currentFileIndex !== idx) || [];
      onChange(updatedFiles);
    }
  };

  const handleChangeDefaultImage = (index: number) => {
    handleSetDefaultImage(index);
    dispatch(
      appActions.setToast({
        open: true,
        message: 'Default image changed successfully.',
        severity: 'success',
      })
    );
  };

  return (
    <Stack marginTop={2}>
      {loading ? (
        <ReactLoader />
      ) : filesPreview?.length ? (
        <>
          <Stack component="label" fontSize={13} marginTop={2}>
            Click to select default image
          </Stack>
          <Stack
            marginBottom={2}
            className="preview-image-multiple-wrapper"
            flexDirection={'row'}
          >
            {filesPreview.map((imageSource, idx) => (
              <Stack
                marginBottom={2}
                className="preview-image-multiple"
                key={imageSource}
                onClick={() => handleChangeDefaultImage(idx)}
                title="Select default image"
              >
                <Stack
                  className={
                    defaultImageIndex === idx
                      ? 'preview-image-multiple__image selected-image'
                      : 'preview-image-multiple__image'
                  }
                >
                  <img src={imageSource} alt="preview_image" />
                </Stack>
                <Stack className="preview-image-multiple__close-button">
                  <img
                    src={closeIcon}
                    alt="Remove file"
                    title="Remove file"
                    onClick={(e) =>
                      handleFileRemove(
                        e,
                        imageSource.includes('blob') ? 'file' : 'url',
                        imageSource,
                        idx,
                      )
                    }
                    className="preview-image-multiple__close-button-icon"
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </>
      ) : null}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />
      {hasError && (
        <Typography sx={{ margin: '4px 14px 0 14px' }} color="error" variant="caption">
          {errorText || ''}
        </Typography>
      )}
      <Button
        variant={hasError ? 'outlined' : variant}
        color={hasError ? 'error' : color}
        fullWidth
        onClick={handleUploadClick}
        disabled={!!loading}
      >
        {loading ? 'Loading...' : label}
      </Button>
    </Stack>
  );
};

export default FileMultiUploader;
