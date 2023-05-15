import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import Check from '../../icons/CheckCircle';
import X from '../../icons/X';
import { experimentalStyled } from '@material-ui/core/styles';
import Lock from '../../icons/Lock';

const STATUS = {
  PASS: 1,
  FAIL: 2,
  DEFAULT: 0
};
const ColoredBox = experimentalStyled(Box, {
  shouldForwardProp: (prop) => prop !== 'isPass' && prop !== 'isFail'
})(({ isPass, isFail }) => ({
  ...(isPass && {
    color: 'green'
  }),
  ...(isFail && {
    color: 'red'
  }),
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
        <Box sx={{ ml: 3 }}>
          {children}
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

export default function TestCasesView(props) {
  const [value, setValue] = React.useState(0);
  const { testCases, testCaseStatus } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTestCaseIOTypography = (header, data) => (
    <Box sx={{ mt: 2 }}>
      <Typography
        color="textSecondary"
        variant="overline"
        sx={{ mb: 0 }}
      >
        {header}
      </Typography>
      <Typography
        variant="body1"
        component="span"
      >
        <pre style={{ fontFamily: 'inherit', margin: 0 }}>
          {data}
        </pre>
      </Typography>
    </Box>
  );

  const getPassedCount = (testCases, status) => {
    let count = 0;
    for (const testCase of testCases) {
      if(status[testCase._id].status === STATUS.PASS)
        count++;
    }
    return count;
  }

  const getTestCaseIcon = (status, hidden) => {
    if (status === STATUS.PASS) {
      return <Check sx={{ ml: '.5rem' }} />;
    }
    if (status === STATUS.FAIL) {
      return <X sx={{ ml: '.5rem' }} />;
    }
    if (hidden) {
      return <Lock sx={{ ml: '.5rem' }} />;
    }
    return <></>;
  };

  return (
    <>
      <Box sx={{ p: 2, display: 'flex' }}>
        <Typography variant="h6">Test cases</Typography>
        <Typography
          variant="subtitle2"
          sx={{ mt: 0.5, ml: 1 }}
        >
          {`${testCases && testCaseStatus? getPassedCount(testCases, testCaseStatus):0} of ${testCases?testCases.length:0} Testcases passed`}
        </Typography>
      </Box>
      <Card elevation={6}>
        <Box
          sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 400, overflow: 'auto' }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            {testCases && testCases.map((testCase, index) => (
              <Tab
                key={testCase.input}
                label={(
                  <ColoredBox
                    sx={{ display: 'flex', p: 2 }}
                    isPass={testCaseStatus[testCase._id].status === STATUS.PASS}
                    isFail={testCaseStatus[testCase._id].status === STATUS.FAIL}
                  >
                    <Typography>
                      {`Test case ${index}`}
                    </Typography>
                    {getTestCaseIcon(testCaseStatus[testCase._id].status, testCase.hidden)}
                  </ColoredBox>
                  )}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
          {
            testCases && testCases.map((testCase, index) => (
              <TabPanel
                key={testCase.input}
                value={value}
                index={index}
              >
                <Grid
                  item
                  xs={12}
                >
                  {testCase.hidden ? (
                    <Box sx={{ mt: 2, display: 'flex' }}>
                      <Box sx={{ mt: 1 }}>
                        <Lock />
                      </Box>
                      <Typography
                        color="textSecondary"
                        variant="overline"
                        fontSize="1rem"
                      >
                        Test case hidden
                      </Typography>
                    </Box>
                  )
                    : (
                      <Box sx={{ p: 1 }}>
                        {getTestCaseIOTypography('Input', testCase.input)}
                        {getTestCaseIOTypography('Expected Output', testCase.expectedOutput)}
                        {testCaseStatus[testCase._id].executionOutput && getTestCaseIOTypography('Your output', testCaseStatus[testCase._id].executionOutput)}
                      </Box>
                    )}
                </Grid>
              </TabPanel>
            ))
        }
        </Box>
      </Card>
    </>
  );
}

TestCasesView.propTypes = {
  testCases: PropTypes.arrayOf(PropTypes.shape({
    input: PropTypes.string.isRequired,
    expectedOutput: PropTypes.string.isRequired,
    status: PropTypes.oneOf(Object.values(STATUS)),
    executionOutput: PropTypes.string,
  })).isRequired,
  testCaseStatus: PropTypes.object,
};
