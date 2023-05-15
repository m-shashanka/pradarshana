import { Box, Grid } from '@material-ui/core';
import EditableQuestionDetails from '../../components/assessment/EditableQuestionDetails';
import React from 'react';
import EditableTestCasesView from './EditableTestCasesView';
import EditableSamplesView from './EditableSamplesView';
import PropTypes from 'prop-types';

const EditCodingQuestionView = (props) => {
  const { question, testCases, handleAddSample, handleDeleteSample, handleAddTestCase, handleDeleteTestCase, handleTestCaseVisbilityChange, handleEditQuestion } = props;
  return (
    <Box
      sx={{ mt: '4rem' }}
    >
      {question && (
        <EditableQuestionDetails
          title={question.title}
          description={question.description}
          inputFormat={question.inputFormat}
          outputFormat={question.outputFormat}
          handleEditQuestion={handleEditQuestion}
          questionId={question._id}
          lang={question.lang}
          codeTemplate={question.codeTemplate}
        />
      )}
      <Grid
        item
        xs={12}
      >
        <Box sx={{ p: 3 }}>
          <EditableSamplesView
            questionId={question._id}
            samples={question.samples}
            handleAddSample={handleAddSample}
            handleDeleteSample={handleDeleteSample}
          />
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
      >
        <Box sx={{ p: 3 }}>
          <EditableTestCasesView
            questionId={question._id}
            testCases={testCases}
            handleAddTestCase={handleAddTestCase}
            handleDeleteTestCase={handleDeleteTestCase}
            handleTestCaseVisbilityChange={handleTestCaseVisbilityChange}
          />
        </Box>
      </Grid>
    </Box>
  );
};
EditCodingQuestionView.propTypes = {
  question: PropTypes.object.isRequired,
  testCases: PropTypes.array.isRequired,
  handleAddSample: PropTypes.func.isRequired,
  handleDeleteSample: PropTypes.func.isRequired,
  handleAddTestCase: PropTypes.func.isRequired,
  handleDeleteTestCase: PropTypes.func.isRequired,
  handleTestCaseVisbilityChange: PropTypes.func.isRequired,
  handleEditQuestion: PropTypes.func.isRequired
};

export default EditCodingQuestionView;
