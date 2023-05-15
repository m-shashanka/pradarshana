import { Box, Grid } from '@material-ui/core';
import QuestionDetails from '../../components/assessment/QuestionDetails';
import CodeEditorView from './CodeEditorView';
import React from 'react';
import { Hidden } from '@mui/material';
import TestCasesView from './TestCasesView';
import PropTypes from 'prop-types';

const CodingQuestionView = (props) => {
  const { question, testCases, customTestCase, handleCustomTestCaseUpdate, isCustomSubmitting, isQuestionSubmitting, codeForQuestion, setCodeForQuestion, compileAndRun, testCaseStatus, submitQuestion } = props;
  const getTestCasesView = () => (
    testCases && (
      <Grid
        item
        xs={12}
      >
        <Box sx={{ p: 3 }}>
          <TestCasesView testCases={testCases} testCaseStatus={testCaseStatus.status}/>
        </Box>
      </Grid>
    )
  );
  return (
    <Box style={{paddingBottom: '200px'}}>
      <Grid
        container
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <Box
            sx={{ mt: '4rem' }}
            style={{ width: 'calc(100vw - 5rem)' }}
          >
            {question && (
              <QuestionDetails
                title={question.title}
                description={question.description}
                samples={question.samples}
                inputFormat={question.inputFormat}
                outputFormat={question.outputFormat}
                lang={question.lang}
              />
            )}
            <Hidden mdDown>
              {getTestCasesView()}
            </Hidden>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
        >
          <Box>
            <CodeEditorView
              language={question.lang}
              customTestCase={customTestCase}
              handleCustomTestCaseUpdate={handleCustomTestCaseUpdate}
              questionId={question._id}
              codeForQuestion={codeForQuestion}
              setCodeForQuestion={setCodeForQuestion}
              compileAndRun={compileAndRun}
              submitQuestion={submitQuestion}
              isSubmiting={isQuestionSubmitting}
              lastSaved={testCaseStatus.lastSaved}
              isCustomSubmitting={isCustomSubmitting}
            />
          </Box>
        </Grid>
        <Hidden mdUp>
          {getTestCasesView()}
        </Hidden>
      </Grid>
    </Box>
  );
};
CodingQuestionView.propTypes = {
  question: PropTypes.object.isRequired,
  testCases: PropTypes.array.isRequired,
  customTestCase: PropTypes.object.isRequired,
  handleCustomTestCaseUpdate: PropTypes.func.isRequired,
  codeForQuestion: PropTypes.object.isRequired,
  setCodeForQuestion: PropTypes.func.isRequired,
  compileAndRun: PropTypes.func.isRequired,
  testCaseStatus: PropTypes.object.isRequired,
  submitQuestion: PropTypes.func.isRequired,
  isQuestionSubmitting: PropTypes.bool.isRequired,
  isCustomSubmitting: PropTypes.bool.isRequired
};

export default CodingQuestionView;
