import React, { useMemo, FC, useRef, ChangeEvent, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { closeIcon } from 'assets/svg';
import { StyledDeleteIcon } from './TagsSelector';

type Props = {
  onChange: (file: File | null) => void;
  clearFileName?: () => void;
  file: File | null;
  selectedFile?: string;
  label: string;
  variant?: 'text' | 'contained' | 'outlined' | undefined;
  hasError?: boolean;
  previewVisible?: boolean;
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

const FileUploader: FC<Props> = ({
  onChange,
  label,
  variant = 'contained',
  color = 'secondary',
  previewVisible = false,
  hasError,
  errorText,
  file,
  selectedFile,
  clearFileName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file && fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  }, [file]);

  const handleUploadClick = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<any>) => {
    const file = event.target.files[0];
    onChange(file);
  };

  const handleFileRemove = () => {
    onChange(null);

    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
    if (clearFileName) {
      clearFileName();
    }
  };

  const filePreview = useMemo(() => {
    if (file) {
      return window.URL.createObjectURL(file)
    }
  }, [file]);

  return (
    <Stack>
      {(file || selectedFile) && !previewVisible ? (
        <Stack direction="row" alignItems="center" marginBottom={2}>
          <Typography
            sx={{ fontWeight: 400, fontSize: '12px' }}
            className="form-title"
            variant="body1"
            component="p"
          >
            {file?.name || selectedFile?.split('/').pop()}
          </Typography>
          <StyledDeleteIcon
            src={closeIcon}
            alt="remove image"
            title="remove image"
            onClick={handleFileRemove}
          />
        </Stack>
      ) : null}
      {previewVisible && (filePreview || selectedFile) ? (
        <img src={filePreview ? filePreview : selectedFile} alt="preview_image" className="preview-image" />
      ) : null}
      <Button
        variant={hasError ? 'outlined' : variant}
        color={hasError ? 'error' : color}
        fullWidth
        onClick={handleUploadClick}
      >
        {label}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {hasError && (
        <Typography sx={{ margin: '4px 14px 0 14px' }} color="error" variant="caption">
          {errorText || ''}
        </Typography>
      )}
    </Stack>
  );
};

export default FileUploader;
