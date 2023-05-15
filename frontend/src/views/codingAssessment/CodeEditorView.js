import AceCodeEditor from '../../components/assessment/AceCodeEditor';
import React, { useState } from 'react';
import { Box, Button, FormControl, Grid, Typography, Stack, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import CustomCodeTab from '../../components/assessment/CustomCodeTab';
import SnackBarAlert from '../../components/SnackBarAlert';
import { LANGS } from '../../constants';
import { AddAlertRounded } from '@material-ui/icons';

const CodeEditorView = (props) => {
  const [showError, setShowError] = useState(false);
  const { language, customTestCase, handleCustomTestCaseUpdate, isCustomSubmitting, questionId, lastSaved, codeForQuestion, isSubmiting, setCodeForQuestion, compileAndRun, submitQuestion } = props;
  const errorMessage = 'Something went wrong. please try again';

  const handleCompileAndRun = () => {
    compileAndRun(questionId);
  }

  React.useEffect(() => {
    localStorage.setItem(questionId, codeForQuestion);
  }, []);

  // alert(codeForQuestion)
  const setCode = (c) => {
    setCodeForQuestion(questionId, c);
  }

  const handleReset = () => {
      if(localStorage.getItem(questionId)) {
        setCode(localStorage.getItem(questionId));
      }
  }

  return (

    <Grid
      container
      sx={{ p: 3 }}
    >
      <Grid
        item
        xs={12}
      >
        <SnackBarAlert
          variant="error"
          vertical="top"
          horizontal="center"
          message={errorMessage}
          open={showError}
        />
        <Stack>
          <Grid
            container
            sx={{ mb: 1, display: 'flex' }}
          >
            <Grid
              item
              sx={{ mt: 2, mb: 2 }}
              xs={12}
              md={8}
            >
              Code Editor
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
            >
              <FormControl fullWidth>
                <Typography
                  align="center"
                  color="textPrimary"
                  gutterBottom
                  variant="p"
                >
                  { `Language: ${LANGS.find((element) => element.id === Number.parseInt(language, 10)).name}` }
                </Typography>
              </FormControl>
            </Grid>
          </Grid>
        </Stack>
        <Stack sx={{ mb: 2 }}>
          <AceCodeEditor
            name="uniqueName"
            code={codeForQuestion}
            onChange={setCode}
            mode="javascript"
            onBlur={setCode}
          />
        </Stack>
        <Stack>
          <Box sx={{ display: 'flex' }}>
          <Box>
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                >
              <Button
                variant="contained"
                onClick={handleReset}
              >
                Reset Code
              </Button>
              
            <p style={{"padddingRight": "2px"}}></p>
              </Stack>
            </Box>
            <Box>
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                >
              <Button
                variant="contained"
                onClick={handleCompileAndRun}
                disabled={isCustomSubmitting}
              >
                Run Custom Test Case
              </Button>
              <CircularProgress
                size={14}
                color="primary"
                style={{ display: isCustomSubmitting ? 'block' : 'none' }}
                />
              </Stack>
            </Box>
            <Box sx={{ ml: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                >
              <Button
                variant="contained"
                color="secondary"
                disabled={isSubmiting}
                onClick={() => submitQuestion(questionId)}
              >
                Submit
              </Button>
              <CircularProgress
                size={14}
                color="primary"
                style={{ display: isSubmiting ? 'block' : 'none' }}
                />
              </Stack>
            </Box>
          </Box>
        </Stack>
        <Grid
          item
          xs={12}
        >
          <Box>
          <Typography
                  align="center"
                  color="textPrimary"
                  gutterBottom
                  variant="p"
                >
                  { `LastSaved: ${lastSaved? new Date(lastSaved).toISOString():'-'}` }
                </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Box>
            <CustomCodeTab
              customInput={customTestCase.input}
              error={customTestCase.status === 2 && customTestCase.output}
              output={customTestCase.status === 1 && customTestCase.output}
              questionId={questionId}
              handleCustomTestCaseUpdate={handleCustomTestCaseUpdate}
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

CodeEditorView.propTypes = {
  language: PropTypes.string.isRequired,
  customTestCase: PropTypes.object.isRequired,
  handleCustomTestCaseUpdate: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
  codeForQuestion: PropTypes.object.isRequired,
  setCodeForQuestion: PropTypes.func.isRequired,
  compileAndRun: PropTypes.func.isRequired,
  submitQuestion: PropTypes.func.isRequired,
  isSubmiting: PropTypes.bool,
  lastSaved: PropTypes.object,
  isCustomSubmitting: PropTypes.bool
};

export default CodeEditorView;
