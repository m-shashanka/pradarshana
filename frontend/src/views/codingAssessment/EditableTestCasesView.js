import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Box,
  Typography,
  Button
} from '@material-ui/core';
import EditableTestCaseCard from '../../components/assessment/EditableTestCaseCard';
import Plus from '../../icons/Plus';
import AddTestCaseModal from '../../components/assessment/AddTestCaseModal';

const EditableTestCasesView = (props) => {
  const { testCases, questionId, handleAddTestCase, handleDeleteTestCase, handleTestCaseVisbilityChange, ...other } = props;
  const [isAddTestCaseModalOpen, setIsAddTestCaseModalOpen] = useState(false);

  const handleAddTestCaseModalOpen = () => {
    setIsAddTestCaseModalOpen(true);
  };

  const handleAddTestCaseModalClose = () => {
    setIsAddTestCaseModalOpen(false);
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ p: 2, display: 'flex' }}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                variant="h6"
              >
                Test Cases
              </Typography>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                startIcon={<Plus fontSize="small" />}
                onClick={handleAddTestCaseModalOpen}
              >
                Add Test Case
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Grid
          container
          spacing={3}
          {...other}
        >
          {testCases.map((testcase, index) => (
            <Grid
              item
              key={testcase.id}
              md={4}
              sm={6}
              xs={12}
            >
              <EditableTestCaseCard
                testcase={testcase}
                index={index}
                questionId={questionId}
                handleDeleteTestCase={handleDeleteTestCase}
                handleTestCaseVisbilityChange={handleTestCaseVisbilityChange}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <AddTestCaseModal
        onApply={handleAddTestCaseModalClose}
        onClose={handleAddTestCaseModalClose}
        open={isAddTestCaseModalOpen}
        questionId={questionId}
        onAdd={handleAddTestCase}
      />
    </>
  );
};

EditableTestCasesView.propTypes = {
  testCases: PropTypes.array.isRequired,
  handleAddTestCase: PropTypes.func.isRequired,
  handleDeleteTestCase: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
  handleTestCaseVisbilityChange: PropTypes.func.isRequired,
};

export default EditableTestCasesView;
