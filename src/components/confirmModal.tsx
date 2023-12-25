import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { FC } from 'react';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  okButtonText: string;
  message: string;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  p: 4,
};

const ConfirmationModal: FC<Props> = ({ isModalOpen, setIsModalOpen, onSubmit, message, okButtonText, onCancel }) => {
  return (
    <Modal
      open={isModalOpen}
    >
      <Stack sx={style}>
        <Stack sx={{ marginBottom: '12px' }} direction={'row'} textAlign={'center'}>
          <Typography variant="body1">
            {message}
          </Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Button
            onClick={() => {
              setIsModalOpen(false)
              onCancel?.();
            }}
            sx={{
              marginTop: '24px',
              color: '#fff',
              maxWidth: '150px',
            }}
            variant="contained"
            color="error"
            fullWidth
          >
            CANCEL
          </Button>
          <Button
            onClick={onSubmit}
            sx={{
              marginTop: '24px',
              color: '#fff',
              maxWidth: '150px',
            }}
            variant="contained"
            color="success"
            fullWidth
          >
            {okButtonText}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ConfirmationModal;
