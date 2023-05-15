import PropTypes from 'prop-types';
import { Box, Button, Dialog, Typography } from '@material-ui/core';

const FullScreenConfirmation = (props) => {
  const { onFullScreenEnter, open, fullScreenExitCount, ...other } = props;

  return (
    <Dialog
      maxWidth="lg"
      BackdropProps={
        {
          style: {
            backgroundColor: 'black'
          }
        }
      }
      open={open}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          Enter fullscreen to start the test
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            - Do not exit from the full screen, activities are recorded
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            {`- You have exited full screen ${fullScreenExitCount} times`}
          </Typography>
        </Box>
        {
          fullScreenExitCount < 3 ? (
            <Box
              sx={{
                mt: 3,
                p: 3
              }}
            >
              <Button
                color="primary"
                fullWidth
                onClick={onFullScreenEnter}
                variant="contained"
              >
                Enter Fullscreen
              </Button>
            </Box>
          ) : (
            <Typography
              align="center"
              color="textPrimary"
              gutterBottom
              variant="h4"
            >
              You have exited full screen more than twice, test will end in 5 secs
            </Typography>
          )
        }
      </Box>
    </Dialog>
  );
};

FullScreenConfirmation.propTypes = {
  onFullScreenEnter: PropTypes.func,
  open: PropTypes.bool.isRequired,
  fullScreenExitCount: PropTypes.number.isRequired
};

export default FullScreenConfirmation;
