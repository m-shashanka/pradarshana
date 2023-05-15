import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';

const TestCaseIOTypography = (props) => {
  const { header, data } = props;
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        color="textSecondary"
        variant="overline"
        sx={{ mb: 0 }}
      >
        {header}
      </Typography>
      <Typography
        variant="body1"
        component="span"
      >
        <pre style={{ fontFamily: 'inherit', margin: 0 }}>
          {data}
        </pre>
      </Typography>
    </Box>
  );
};

TestCaseIOTypography.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
};

export default TestCaseIOTypography;
