import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Card, CardHeader, CardContent, Button, Divider, Typography, Switch, Grid, CircularProgress, Stack } from '@material-ui/core';
import TrashIcon from '../../icons/Trash';
import { assessmentService } from '../../service/test/AssessmentService';
import TestCaseIOTypography from './TestCaseIOTypography';

const EditableTestCaseCard = (props) => {
  const { testcase, index, handleDeleteTestCase, questionId, handleTestCaseVisbilityChange, ...others } = props;
  const [isCurrentlyHidden, setIsCurrentlyHidden] = useState(testcase.hidden);
  const [isCurrentlyDisabled, setIsCurrentlyDisabled] = useState(false);

  const handleHideToggle = async (e) => {
    e.preventDefault();
    const visibility = e.target.checked;
    setIsCurrentlyHidden(visibility);
    setIsCurrentlyDisabled(true);
    try {
      const { data } = await assessmentService.changeTestCaseVisibility(questionId, testcase._id, visibility);
      if (data && data.success) {
        handleTestCaseVisbilityChange(questionId, testcase._id, visibility);
        toast.success('TestCase updated successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to change visibility!');
      setIsCurrentlyHidden(!visibility);
    }
    setIsCurrentlyDisabled(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await assessmentService.deleteTestCase(questionId, testcase._id);
      if (data && data.success) {
        handleDeleteTestCase(questionId, testcase._id);
        toast.success('TestCase deleted successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete testcase!');
    }
  };

  return (
    <Card {...others}>
      <CardHeader title={`Test Case ${index}`} />
      <Divider />
      <CardContent>
        <Box
          sx={{
            mb: 2,
            mt: 1
          }}
        >
          <TestCaseIOTypography
            header="Input"
            data={testcase.input}
          />
          <TestCaseIOTypography
            header="Expected Output"
            data={testcase.expectedOutput}
          />
        </Box>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <Button
              startIcon={<TrashIcon fontSize="small" />}
              sx={{
                backgroundColor: 'error.main',
                color: 'error.contrastText',
                '&:hover': {
                  backgroundColor: 'error.dark'
                }
              }}
              variant="contained"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Grid>
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
        </Grid>

      </CardContent>
    </Card>
  );
};

EditableTestCaseCard.propTypes = {
  testcase: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleDeleteTestCase: PropTypes.func.isRequired,
  handleTestCaseVisbilityChange: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
};

export default EditableTestCaseCard;
