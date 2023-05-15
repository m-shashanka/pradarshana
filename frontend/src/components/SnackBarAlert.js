import React, { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';

const CustomAlert = React.forwardRef((props, ref) => (
  <Alert
    elevation={6}
    ref={ref}
    variant="filled"
    {...props}
  />
));

export default function SnackBarAlert(props) {
  const [openSnack, setOpenSnack] = React.useState(false);

  const { vertical, horizontal, message, open, variant } = props;

  const handleClose = () => {
    setOpenSnack(false);
  };

  useEffect(() => {
    setOpenSnack(open);
  }, [open]);

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnack}
        onClose={handleClose}
        key={vertical + horizontal}
        autoHideDuration={10000}
      >
        <CustomAlert
          onClose={handleClose}
          severity={variant}
          sx={{ width: '100%' }}
        >
          {message}
        </CustomAlert>
      </Snackbar>
    </div>
  );
}
SnackBarAlert.propTypes = {
  open: PropTypes.bool,
  vertical: PropTypes.oneOf(['top', 'bottom']),
  horizontal: PropTypes.oneOf(['right', 'left', 'center']),
  message: PropTypes.string,
  variant: PropTypes.oneOf(['success', 'info', 'warning', 'error'])
};
