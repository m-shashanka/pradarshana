import * as React from 'react';
import { experimentalStyled } from '@material-ui/core/styles';
import { Card, CardHeader, Chip, Divider, TextField, Box } from '@material-ui/core';
import { Tabs, Tab } from '@mui/material';
import HeaderDetailTypography from '../HeaderDetailTypography';
import Check from '../../icons/Check';
import X from '../../icons/X';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const StyledTabs = experimentalStyled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

const EXECUTION_STATUS = {
  NOT_EXECUTED: 'NOT_EXECUTED',
  EXECUTED_AND_PASSED: 'EXECUTED_AND_PASSED',
  EXECUTED_AND_FAILED: 'EXECUTED_AND_FAILED'
};

const StyledTab = experimentalStyled((props) => (
  <Tab
    disableRipple
    {...props}
  />
))(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);

const CustomCodeTab = (props) => {
  const [value, setValue] = React.useState(1);
  const { customInput, output, error, questionId, handleCustomTestCaseUpdate } = props;
  const [executionStatus, setExecutionStatus] = React.useState(EXECUTION_STATUS.NOT_EXECUTED);

  useEffect(() => {
    if (output) {
        setExecutionStatus(EXECUTION_STATUS.EXECUTED_AND_PASSED);
    } else if (error) {
      setExecutionStatus(EXECUTION_STATUS.EXECUTED_AND_FAILED);
    }
    else {
      setExecutionStatus(EXECUTION_STATUS.NOT_EXECUTED)
    }
  }, [output, error]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getExecutionStatusChip = (status) => {
    if (status === EXECUTION_STATUS.EXECUTED_AND_PASSED) {
      return (
        <Chip
          size="small"
          icon={<Check />}
          label="Passed"
          color="primary"
        />
      );
    }
    if (status === EXECUTION_STATUS.EXECUTED_AND_FAILED) {
      return (
        <Chip
          size="small"
          icon={<X />}
          label="Failed"
          color="error"
        />
      );
    }
    return (
      <Chip
        size="small"
        label="yet to execute"
      />
    );
  };

  const handleInputChange = (e) => {
    handleCustomTestCaseUpdate(questionId, {input:e.target.value, output:null, status:0});
  }

  return (
    <Card
      elevation={6}
      sx={{ width: '100%', mt: 7 }}
    >
      <CardHeader
        title="Custom Testcase"
        subheader="executes on compile & run"
        subheaderTypographyProps={{
          fontSize: 12
        }}
      />
      <Divider />
      <Box sx={{ width: '100%' }}>
        <Box>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="styled tabs example"
          >
            <StyledTab label="TestCase" />
            <StyledTab label="Output" />
          </StyledTabs>
          {value === 0 && (
          <Box sx={{ p: 3 }}>
            <TextField
              labelId="customTestcase"
              fullWidth
              defaultValue={customInput}
              label="Testcase input"
              onChange={handleInputChange}
              multiline
              minRows={2}
            />
          </Box>
          )}
          {value === 1 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ float: 'right' }}>{getExecutionStatusChip(executionStatus)}</Box>
            <HeaderDetailTypography
              header="Custom input"
              detail={customInput}
            />
            {output && (
            <HeaderDetailTypography
              header="Your output"
              detail={output}
              mt={2}
            />
            )}
            {error && (
            <HeaderDetailTypography
              header="Error"
              detail={error}
              mt={2}
            />
            )}
          </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

CustomCodeTab.propTypes = {
  customInput: PropTypes.string.isRequired,
  output: PropTypes.string,
  error: PropTypes.string,
  handleCustomTestCaseUpdate: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
};
export default CustomCodeTab;
