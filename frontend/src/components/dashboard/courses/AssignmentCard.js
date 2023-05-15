import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Divider,
  Grid,
  Link,
  Typography,
  Button,
  CardActions,
  Chip,
  Stack,
  CircularProgress,
  Switch
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAlt from '../../../icons/PencilAlt';
import Duplicate from '../../../icons/Duplicate';
import getDateTime from '../../../utils/getDateTime';
import { courseService } from '../../../service/course/CourseService';
import { assessmentService } from '../../../service/test/AssessmentService';
import ProfessorChatModal from './ProfessorChatModal';

const isTestActive = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();
  return (now >= startDate && now <= endDate);
}

const AssignmentCard = (props) => {
  const { assignment, isEditable, editAssignment, handleAssignmentVisbilityChange, handleAssignmentProctoringChange, handleAssignmentCopy, courseName, ...other } = props;

  const [isCurrentlyHidden, setIsCurrentlyHidden] = useState(!assignment.isAccessible);
  const [isCurrentlyProctored, setIsCurrentlyProctored] = useState(assignment.isProctored);
  const [isCurrentlyDisabled, setIsCurrentlyDisabled] = useState(false);
  const [isCurrentlyDisabled2, setIsCurrentlyDisabled2] = useState(false);
  const [isCurrentlyCopying, setIsCurrentlyCopying] = useState(false);
  const [open, setOpen] = useState(false);

  const handleHideToggle = async (e) => {
    e.preventDefault();
    const visibility = e.target.checked;
    setIsCurrentlyHidden(visibility);
    setIsCurrentlyDisabled(true);
    try {
      const { data } = await courseService.updateAssignmentVisibility(assignment._id, !visibility);
      if (data && data.success) {
        handleAssignmentVisbilityChange(assignment._id, visibility);
        toast.success('Test updated successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to change visibility!');
      setIsCurrentlyHidden(!visibility);
    }
    setIsCurrentlyDisabled(false);
  };

  const handleHideToggle2 = async (e) => {
    e.preventDefault();
    const proctoring = e.target.checked;
    setIsCurrentlyProctored(proctoring);
    setIsCurrentlyDisabled2(true);
    try {
      const { data } = await courseService.updateAssignmentProctoring(assignment._id, proctoring);
      if (data && data.success) {
        handleAssignmentProctoringChange(assignment._id, proctoring);
        toast.success('Test updated successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to change proctoring mode!');
      setIsCurrentlyProctored(!proctoring);
    }
    setIsCurrentlyDisabled2(false);
  };

  const handleCopy = async (e) => {
    e.preventDefault();
    setIsCurrentlyCopying(true);
    try {
      const { data } = await assessmentService.copyAssignment(assignment._id);
      if (data && data.success) {
        handleAssignmentCopy({
          ...assignment,
          _id: data.id,
          title: `${assignment.title} - Copy`,
        });
        toast.success('Assignment copied successfully!');
      }
    } catch (err) {
      toast.error('Failed to copy assignment!');
    }
    setIsCurrentlyCopying(false);
  };

  const openChat = () => {
    setOpen(true);
  }

  const closeChat = () => {
    setOpen(false);
  }

  return (
    <>
      <ProfessorChatModal testId={assignment._id} open={open} closeChat={closeChat} />
      <Card {...other}>
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              display: 'flex',
              mt: 2
            }}
          >
            <Box
              sx={{ ml: 2 }}
            >
              <Link
                color="textPrimary"
                component={RouterLink}
                to="#"
                variant="h6"
              >
                {assignment.title}
              </Link>
            </Box>
            {
              isEditable && (
                <Box
                  sx={{ ml: 2 }}
                >
                  <Chip
                    label={<Duplicate fontSize='small' />}
                    variant="outlined"
                    disabled={isCurrentlyCopying}
                    color="primary"
                    onClick={handleCopy}
                  />
                </Box>
              )
            }
          </Box>
        </Box>
        <Box
          sx={{
            pb: 2,
            px: 3
          }}
        >
          {
            assignment.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                color="primary"
                sx={{
                  mr: 1
                }}
              />
            ))
          }
          {
            isCurrentlyProctored && <Chip
              label={'Proctored Test'}
              variant="outlined"
              color="primary"
              sx={{
                mr: 1
              }}
            />
          }
        </Box>
        <Box
          sx={{
            px: 3,
            py: 2
          }}
        >
          <Grid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={isEditable ? 2 : 3.5}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="subtitle2"
                textAlign="center"
              >
                {isEditable ? `${assignment.totalAttempts}` : `${assignment.attemptsLeft}/${assignment.totalAttempts}`}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Attempts
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {getDateTime(assignment.startDate)}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Start Date
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {getDateTime(assignment.deadline)}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Deadline
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                color="textPrimary"
                variant="subtitle2"
                textAlign="center"
              >
                {Math.floor(assignment.minutes / 60) > 0 ? (`${Math.floor(assignment.minutes / 60)} hr ${assignment.minutes % 60} min`) : (`${assignment.minutes} min`)}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Test time
              </Typography>
            </Grid>
            {isEditable && (
              <Grid
                item
              >
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                  textAlign="center"
                >
                  Proctoring
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <CircularProgress
                    size={16}
                    color="primary"
                    style={{ display: isCurrentlyDisabled2 ? 'block' : 'none' }}
                  />
                  <Switch
                    checked={isCurrentlyProctored}
                    onChange={handleHideToggle2}
                    disabled={isCurrentlyDisabled2}
                    color="primary"
                    edge="start"
                    name="isVerified"
                  />
                </Stack>
              </Grid>
            )
            }
            {isEditable && (
              <Grid item>
                <Button disabled={!isTestActive(assignment.startDate, assignment.deadline) || isCurrentlyHidden || !isCurrentlyProctored} 
                variant="contained" onClick={openChat} >Go Live</Button>
              </Grid>
            )}
            {isEditable && (
              <Grid
                item
              >
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                  textAlign="center"
                >
                  Hidden
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <CircularProgress
                    size={16}
                    color="primary"
                    style={{ display: isCurrentlyDisabled ? 'block' : 'none' }}
                  />
                  <Switch
                    checked={isCurrentlyHidden}
                    onChange={handleHideToggle}
                    disabled={isCurrentlyDisabled}
                    color="primary"
                    edge="start"
                    name="isVerified"
                  />
                </Stack>
              </Grid>
            )
            }
          </Grid>
        </Box>
        <Divider />
        <CardActions
          sx={{ justifyContent: 'space-between' }}
        >
          {
            isEditable ? (
              <>
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={<PencilAlt />}
                  onClick={() => editAssignment(assignment)}
                >
                  Edit
                </Button>
                <Link
                  component={RouterLink}
                  to={`/dashboard/professor/statistics/${assignment._id}`}
                  underline="none"
                >
                  <Button
                    color="primary"
                    endIcon={<ArrowRightIcon fontSize="small" />}
                    variant="text"
                  >
                    Show Stats
                  </Button>
                </Link>
                <Link
                  component={RouterLink}
                  to={`/dashboard/professor/edit-test-questions/${assignment._id}`}
                  underline="none"
                >
                  <Button
                    color="primary"
                    endIcon={<ArrowRightIcon fontSize="small" />}
                    variant="text"
                  >
                    Edit Questions
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  component={RouterLink}
                  to={`/assessment/${assignment._id}`}
                  onClick={()=>{
                    window.saveDataAcrossSessions = true;
                    localStorage.setItem('courseName', courseName)
                  }}
                  underline="none"
                >
                  <Button
                    color="primary"
                    endIcon={<ArrowRightIcon fontSize="small" />}
                    variant="text"
                  >
                    Take test
                  </Button>
                </Link>

                <Link
                  component={RouterLink}
                  to={`/assessment-survey/${assignment._id}`}
                  underline="none"
                >
                  <Button
                    color="primary"
                    endIcon={<ArrowRightIcon fontSize="small" />}
                    variant="text"
                  >
                    Take Survey
                  </Button>
                </Link>
              </>
            )
          }
        </CardActions>
      </Card>
    </>
  );
};

AssignmentCard.propTypes = {
  assignment: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  editAssignment: PropTypes.func,
  handleAssignmentVisbilityChange: PropTypes.func,
  handleAssignmentCopy: PropTypes.func,
};

export default AssignmentCard;
