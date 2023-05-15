import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import {
  CourseBrief,
  CourseMetadata
} from '../../components/dashboard/courses';

const CourseOverview = (props) => {
  const { course, showEdit, onClickEdit, ...other } = props;

  return (
    <Grid
      container
      spacing={3}
      {...other}
    >
      <Grid
        item
        lg={8}
        xl={9}
        xs={12}
      >
        <CourseBrief
          details={course.description}
          name={course.name}
          showEdit={showEdit}
          onClickEdit={onClickEdit}
        />
      </Grid>
      <Grid
        item
        lg={4}
        xl={3}
        xs={12}
      >
        <CourseMetadata
          professorName={course.createdBy.name}
        />
      </Grid>
    </Grid>
  );
};

CourseOverview.propTypes = {
  course: PropTypes.object.isRequired,
  showEdit: PropTypes.bool,
  onClickEdit: PropTypes.func
};

export default CourseOverview;
