import * as React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { blue, red, yellow } from '@material-ui/core/colors';
import CodingQuestionView from './CodingQuestionView';
import FullScreenConfirmation from '../../components/assessment/FullScreenConfirmation';

import Paper from '@mui/material/Paper';

import FetchMcq from "../../components/assessment/FetchMcq";
import FetchSubjectiveQuestion from '../../components/assessment/FetchSubjectiveQuestion';

const useStyles = makeStyles(() => ({
  flexContainerVertical: {
    display: 'flex',
    alignItems: 'center',
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        // TODO: remove padding on XS
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function parser(time) {
  const len = `${time}`;
  if (len.length === 1) {
    return `0${time}`;
  }
  return len;
}

export default function SideBar(props) {
  const [value, setValue] = React.useState(0);
  const { questions, isFullScreen, handleFullScreenEnter,
    testCaseStatus, fullScreenExitCount, customTestCase,
    handleCustomTestCaseUpdate, codeForQuestion, setCodeForQuestion,
    compileAndRun, submitQuestion, isQuestionSubmitting, isCustomSubmitting } = props;
  const { detail, mcq, subjectiveQuestions } = props;
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '91vh', overflowY: 'auto' }}
    >

      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        scrollButtons={false}
        aria-label="Questions vertical tab"
        sx={{ borderRight: 1, borderColor: 'divider', width: '5rem' }}
        classes={{
          flexContainerVertical: classes.flexContainerVertical
        }}
      >
        {[...questions, ...mcq, ...subjectiveQuestions].map(((question, index) => (
          <Tab
            sx={{ mt: 1, width: '100%' }}
            key={question}
            label={(
              <Avatar sx={(index < questions.length )? { bgcolor: blue[700] }: (index < questions.length + mcq.length )? { bgcolor: red[700] }: {bgcolor: yellow[700]}}>
                {index}
              </Avatar>
            )}
            {...a11yProps(index)}
          />
        )))}

      </Tabs>
      {questions && [...questions, ...mcq, ...subjectiveQuestions].map((question, index) => (
        <TabPanel
          key={question.title}
          value={value}
          index={index}
        >

        {
          (index < questions.length )? (
          <CodingQuestionView
            question={question}
            testCases={question.testCases}
            customTestCase={customTestCase[question._id]}
            handleCustomTestCaseUpdate={handleCustomTestCaseUpdate}
            codeForQuestion={codeForQuestion[question._id]}
            setCodeForQuestion={setCodeForQuestion}
            compileAndRun={compileAndRun}
            submitQuestion={submitQuestion}
            testCaseStatus={testCaseStatus[question._id]}
            isQuestionSubmitting={isQuestionSubmitting[question._id]?isQuestionSubmitting[question._id]:false}
            isCustomSubmitting={isCustomSubmitting[question._id]?isCustomSubmitting[question._id]:false}
          />
          ): (index < questions.length + mcq.length )?(

          <Paper elevation={1} style={{padding: "20px", textAlign: "center", minWidth: "300px"}}>
            <FetchMcq
                mcq={question}
                detailsId={detail._id}
            />
          </Paper>
          ) : (
            <Paper elevation={1} style={{padding: "20px", textAlign: "center", minWidth: "95vw"}}>
              <FetchSubjectiveQuestion
                ques={question}
                detailsId={detail._id}
              />
            </Paper>
          )
        }
        </TabPanel>
      ))}
      <FullScreenConfirmation
        onFullScreenEnter={handleFullScreenEnter}
        open={!isFullScreen}
        fullScreenExitCount={fullScreenExitCount}
      />
    </Box>
    </>
  );
}

SideBar.propTypes = {
  questions: PropTypes.array.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  handleFullScreenEnter: PropTypes.func.isRequired,
  fullScreenExitCount: PropTypes.number.isRequired,
  customTestCase: PropTypes.object.isRequired,
  codeForQuestion: PropTypes.object.isRequired,
  handleCustomTestCaseUpdate: PropTypes.func.isRequired,
  setCodeForQuestion: PropTypes.func.isRequired,
  compileAndRun: PropTypes.func.isRequired,
  testCaseStatus: PropTypes.object.isRequired,
  submitQuestion: PropTypes.func.isRequired,
  isQuestionSubmitting: PropTypes.object.isRequired,
  isCustomSubmitting: PropTypes.object.isRequired,
};
