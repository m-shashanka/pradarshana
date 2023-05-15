import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Button, Dialog, TextField, Typography, Stack, Switch } from '@material-ui/core';
import { assessmentService } from '../../service/test/AssessmentService';
import * as Yup from 'yup';
import { Formik } from 'formik';

const AddTestCaseModal = (props) => {
  const { onApply, onClose, open, questionId, onAdd, ...other } = props;

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Formik
        initialValues={{
          input: '',
          expectedOutput: '',
          hidden: false,
        }}
        validationSchema={Yup
          .object()
          .shape({
            input: Yup.string().required(),
            expectedOutput: Yup.string().required(),
            hidden: Yup.boolean().required(),
          })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { data } = await assessmentService.addTestCase(questionId, values);
            if (data && data.success) {
              onAdd(questionId, {
                _id: data.id,
                ...values
              });
              toast.success('TestCase added successfully!');
            }
          } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
          } finally {
            setSubmitting(false);
          }
          if (onApply) onApply();
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values
        }) => (
          <form
            onSubmit={handleSubmit}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="textPrimary"
                gutterBottom
                variant="h4"
              >
                Add TestCase
              </Typography>
              <Box sx={{ mt: 3 }}>
                <TextField
                  FormHelperTextProps={{
                    sx: {
                      textAlign: 'right',
                      mr: 0
                    }
                  }}
                  multiline
                  error={Boolean(touched.input && errors.input)}
                  fullWidth
                  helperText={touched.input && errors.input
                    ? errors.input
                    : 'Press Enter for new line'}
                  label="Input"
                  name="input"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.input}
                  variant="outlined"
                />
                <TextField
                  FormHelperTextProps={{
                    sx: {
                      textAlign: 'right',
                      mr: 0
                    }
                  }}
                  error={Boolean(touched.expectedOutput && errors.expectedOutput)}
                  fullWidth
                  helperText={touched.expectedOutput && errors.expectedOutput
                    ? errors.expectedOutput
                    : 'Press Enter for new line'}
                  label="Expected Output"
                  name="expectedOutput"
                  onBlur={handleBlur}
                  multiline
                  onChange={handleChange}
                  value={values.expectedOutput}
                  variant="outlined"
                />
                <Typography
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    mt: 3,
                  }}
                  variant="subtitle2"
                >
                  Set testcase visibility
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  mb={2}
                  alignItems="center"
                >
                  <Typography>Visible</Typography>
                  <Switch
                    value={values.hidden}
                    onChange={handleChange}
                    name="hidden"
                    onBlur={handleBlur}
                  />
                  <Typography>Hidden</Typography>
                </Stack>
                <Button
                  color="primary"
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Add Test Case
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

AddTestCaseModal.propTypes = {
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  questionId: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddTestCaseModal;
