import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardHeader,
  Link,
  Typography
} from '@material-ui/core';
import getInitials from '../../../utils/getInitials';

const CourseMetadata = (props) => {
  const { professorName, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader
        avatar={(
          <Avatar>
            {getInitials(professorName)}
          </Avatar>
        )}
        disableTypography
        subheader={(
          <Link
            color="textPrimary"
            component={RouterLink}
            to="#"
            underline="none"
            variant="subtitle2"
          >
            {professorName}
          </Link>
        )}
        title={(
          <Typography
            color="textSecondary"
            display="block"
            variant="overline"
          >
            Professor
          </Typography>
        )}
      />
    </Card>
  );
};

CourseMetadata.propTypes = {
  professorName: PropTypes.string.isRequired,
};

export default CourseMetadata;
