import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Link,
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import useAuth from '../../../hooks/useAuth';
import CourseIcon from '../../../icons/course-icon.jpeg';

const CoursesModal = (props) => {
  const { user } = useAuth();
  return (
    <Card {...props}>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar
          variant="rounded"
          src={CourseIcon}
          alt="Course Icon"
          style={{
            width: 150,
            height: 150,
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            p: 2,
          }}
        >
          <div>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              View all Courses
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ mt: 1 }}
              variant="subtitle2"
            >
              Go to the courses page to view all the registred courses
            </Typography>
          </div>
          <Box sx={{ flexGrow: 1 }} />
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Link
          to={user.isProfessor ? 'professor/courses' : 'student/courses'}
          underline="none"
          component={RouterLink}
        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon fontSize="small" />}
            variant="text"
          >
            Explore Courses
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default CoursesModal;
