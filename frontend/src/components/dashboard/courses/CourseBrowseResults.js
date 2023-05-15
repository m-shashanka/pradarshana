import { useState } from 'react';
import PropTypes from 'prop-types';
import { experimentalStyled } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@material-ui/core';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import AddIcon from '@material-ui/icons/Add';
import CourseCard from './CourseCard';
import Fab from '@material-ui/core/Fab';

const StyledTypography = experimentalStyled(Typography)(({ theme }) => ({
  position: 'relative',
  '&:after': {
    backgroundColor: theme.palette.primary.main,
    bottom: '-8px',
    content: '" "',
    height: '3px',
    left: 0,
    position: 'absolute',
    width: '48px',
  },
}));

const CourseBrowseResults = (props) => {
  const { courses, isEditable, ...other } = props;
  const [mode, setMode] = useState('grid');


  const handleModeChange = (event, value) => {
    setMode(value);
  };

  return (
    <div {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <StyledTypography
          color="textPrimary"
          variant="h5"
        >
          Showing
          {' '}
          {courses.length}
          {' '}
          courses
        </StyledTypography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <ToggleButtonGroup
            exclusive
            onChange={handleModeChange}
            size="small"
            value={mode}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Grid
        container
        spacing={3}
      >
        {courses.map((course) => (
          <Grid
            item
            key={course.id}
            md={mode === 'grid' ? 4 : 12}
            sm={mode === 'grid' ? 6 : 12}
            xs={12}
          >
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 6,
        }}
      >
        <Pagination count={3} />
      </Box>
      {
        isEditable && (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'fixed',
              marginRight: 50,
              marginBottom: 65,
              bottom: 0,
              right: 0
            }}
          >
            <Fab
              color="primary"
              variant="extended"
              aria-label="add"
              component={RouterLink}
              to={{
                pathname: '/dashboard/professor/addCourse',
              }}
              size="small"
              sx={{
                pl: 2,
              }}
            >
              Add Course
              <AddIcon
                sx={{
                  ml: 1,
                }}
              />
            </Fab>
          </Box>
        )
      }
    </div>
  );
};

CourseBrowseResults.propTypes = {
  courses: PropTypes.array.isRequired,
  isEditable: PropTypes.bool,
};

export default CourseBrowseResults;
