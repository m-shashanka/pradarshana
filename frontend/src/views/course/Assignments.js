import PropTypes from 'prop-types';
import {
  Grid,
  Button,
  Box,
  Fab
} from '@material-ui/core';
import {
  AssignmentCard
} from '../../components/dashboard/courses';
import Plus from '../../icons/Plus';

const Assignments = (props) => {
  const { assignments, isEditable, onCreateClick, editAssignment, handleAssignmentVisbilityChange, handleAssignmentProctoringChange, handleAssignmentCopy, courseName, ...other } = props;

  return (
    <>
      <Grid
        container
        justifyContent="flex-end"
        spacing={3}
      >
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
                component={Button}
                startIcon={<Plus fontSize="small" />}
                onClick={onCreateClick}
              >
                New
              </Fab>
            </Box>
          )
        }
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Grid
          container
          spacing={3}
          {...other}
        >
          {assignments.map((assignment) => (
            <Grid
              item
              key={assignment.id}
              md={4}
              sm={6}
              xs={12}
            >
              <AssignmentCard
                courseName={courseName}
                assignment={assignment}
                isEditable={isEditable}
                editAssignment={editAssignment}
                handleAssignmentVisbilityChange={handleAssignmentVisbilityChange}
                handleAssignmentProctoringChange={handleAssignmentProctoringChange}
                handleAssignmentCopy={handleAssignmentCopy}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

Assignments.propTypes = {
  assignments: PropTypes.array.isRequired,
  isEditable: PropTypes.bool,
  onCreateClick: PropTypes.func,
  editAssignment: PropTypes.func,
  handleAssignmentVisbilityChange: PropTypes.func,
  handleAssignmentCopy: PropTypes.func,
};

export default Assignments;
