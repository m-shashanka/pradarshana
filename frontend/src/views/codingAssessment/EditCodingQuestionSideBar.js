import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar, Modal, Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { blue, red, yellow } from '@material-ui/core/colors';
import EditCodingQuestionView from './EditCodingQuestionView';
import Plus from '../../icons/Plus';
import AddMcqQuestionForm from '../../components/assessment/AddMcqQuestionForm'
import AddSubjectiveQuestionForm from '../../components/assessment/AddSubjectiveQuestionForm';


const style = {
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


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
      hidden={value - 1 !== index}
      style={{ width: '100%' }}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value - 1 === index && (
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


function Comp({isMcq, question, index}) {

  const [open, setOpen] = React.useState(false);

  function handleClose() {
    setOpen(!open);
  }

  return (
    <>
      <Tab
            sx={{ mt: 1, width: '100%' }}
            key={question}
            label={(
             
                  <Avatar 
                    onClick={handleClose}
                    sx={isMcq ? { bgcolor: red[500] } : {bgcolor: yellow[500]}}>
                    { index + 1}
                  </Avatar>
            )}
            {...a11yProps(index)}
          />

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
              style={{overflow: "scroll"}}
            >
              <Box sx={{ ...style, width: 1000 }}>
                {isMcq? <AddMcqQuestionForm
                  optionss={question.options}
                  answers={+question.answer}
                  titles={question.title}
                  descriptions={question.description}
                  mcqId={question._id}
                />: <AddSubjectiveQuestionForm
                  quesId={question._id}
                  descriptions={question.description}
                  titles={question.title}
                  expectedAnswers={question.expectedAnswer}
                />}
              </Box>
            </Modal>
    </>
  )
}
export default function EditCodingQuestionSideBar(props) {
  const [value, setValue] = React.useState(1);
  const { questions, mcq, subjectiveQuestions, testId, handleAddSample, handleDeleteSample, handleAddTestCase, handleDeleteTestCase, handleTestCaseVisbilityChange, handleEditQuestion } = props;
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    if (newValue !== 0) setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
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
        {[...Object.keys(questions), questions.length].map(((question, index) => (
          <Tab
            sx={{ mt: 1, width: '100%' }}
            key={question}
            label={(
              (index !== 0)
                ? (
                  <Avatar sx={{ bgcolor: blue[700] }}>
                    {index}
                  </Avatar>
                )
                : (<>

                    <Link
                      to="add-question"
                      title={"Add Coding Question"}
                    >
                      <Avatar
                        sx={{ bgcolor: blue[700] }}
                        icon={<Plus fontSize="small" />}
                      >
                        <Plus fontSize="small" />
                      </Avatar>
                    </Link>
                    <p></p>

                  <Link
                    to="add-mcq-question"
                      title={"Add MCQ Question"}
                  >
                    <Avatar
                      sx={{ bgcolor: red[700] }}
                      icon={<Plus fontSize="small" />}
                    >
                      <Plus fontSize="small" />
                    </Avatar>
                  </Link>
                  <p></p>

                  <Link
                      to="add-subjective-question"
                      title={"Add Subjective Question"}
                    >
                      <Avatar
                        sx={{ bgcolor: yellow[700] }}
                        icon={<Plus fontSize="small" />}
                      >
                        <Plus fontSize="small" />
                      </Avatar>
                    </Link>
                  </>
                )
            )}
            {...a11yProps(index)}
          />
        )))}

           {mcq.map(((question, index) => (
            <Comp isMcq question={question} index={index} />

        )))}

          {subjectiveQuestions.map(((question, index) => (
              <Comp question={question} index={index} />
          )))}

      </Tabs>
      {questions && questions.map((question, index) => (
        <TabPanel
          key={question.title}
          value={value}
          index={index}
        >
          <EditCodingQuestionView
            question={question}
            testCases={question.testCases}
            handleAddSample={handleAddSample}
            handleDeleteSample={handleDeleteSample}
            handleAddTestCase={handleAddTestCase}
            handleDeleteTestCase={handleDeleteTestCase}
            handleTestCaseVisbilityChange={handleTestCaseVisbilityChange}
            handleEditQuestion={handleEditQuestion}
          />


        </TabPanel>
      ))}

    </Box>
  );
}

EditCodingQuestionSideBar.propTypes = {
  questions: PropTypes.array.isRequired,
  handleAddSample: PropTypes.func.isRequired,
  handleDeleteSample: PropTypes.func.isRequired,
  handleAddTestCase: PropTypes.func.isRequired,
  handleDeleteTestCase: PropTypes.func.isRequired,
  handleTestCaseVisbilityChange: PropTypes.func.isRequired,
  handleEditQuestion: PropTypes.func.isRequired
};
