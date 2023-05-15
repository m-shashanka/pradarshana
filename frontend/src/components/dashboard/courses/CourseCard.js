import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Box,
  Card,
  CardActions,
  CardMedia,
  Divider,
  Link,
  Typography
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';

const CourseCard = (props) => {
  const { course, ...other } = props;

  return (
    <Card {...other}>
      <Box sx={{ p: 3 }}>
        <CardMedia
          image="/static/mock-images/projects/project_1.png" // Using static image for now can be changed to course.image once implemented in backend
          sx={{
            backgroundColor: 'background.default',
            height: 200
          }}
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 2
          }}
        >
          <Box sx={{ ml: 2 }}>
            <Link
              color="textPrimary"
              component={RouterLink}
              to="#"
              variant="h6"
            >
              {course.name}
            </Link>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              by
              {' '}
              <Link
                color="textPrimary"
                component={RouterLink}
                to="#"
                variant="subtitle2"
              >
                {course.createdBy.name}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          pb: 2,
          px: 3
        }}
      >
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {course.details}
        </Typography>
      </Box>
      <Divider />
      <CardActions>
        <Link
          component={RouterLink}
          to={course._id}
          underline="none"
        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon fontSize="small" />}
            variant="text"
          >
            Go to Course
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

CourseCard.propTypes = {
  course: PropTypes.object.isRequired
};

export default CourseCard;
