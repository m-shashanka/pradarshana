import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Button, Dialog, TextField, Typography } from '@material-ui/core';
import { assessmentService } from '../../service/test/AssessmentService';
import * as Yup from 'yup';
import { Formik } from 'formik';

const AddSamplesModal = (props) => {
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
          output: '',
          explanation: '',
        }}
        validationSchema={Yup
          .object()
          .shape({
            input: Yup.string().required(),
            output: Yup.string().required(),
            explanation: Yup.string().max(5000).required(),
          })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { data } = await assessmentService.addSample(questionId, values);
            if (data && data.success) {
              onAdd(questionId, {
                _id: data.id,
                ...values
              });
              toast.success('Sample added successfully!');
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
                Add Sample
              </Typography>
              <Box sx={{ mt: 3 }}>
                <TextField
                  FormHelperTextProps={{
                    sx: {
                      textAlign: 'right',
                      mr: 0
                    }
                  }}
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
                  multiline
                  variant="outlined"
                />
                <TextField
                  FormHelperTextProps={{
                    sx: {
                      textAlign: 'right',
                      mr: 0
                    }
                  }}
                  error={Boolean(touched.output && errors.output)}
                  fullWidth
                  helperText={touched.output && errors.output
                    ? errors.output
                    : 'Press Enter for new line'}
                  label="Output"
                  name="output"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiline
                  value={values.output}
                  variant="outlined"
                />
                <TextField
                  FormHelperTextProps={{
                    sx: {
                      textAlign: 'right',
                      mr: 0
                    }
                  }}
                  error={Boolean(touched.explanation && errors.explanation)}
                  fullWidth
                  multiline
                  helperText={touched.explanation && errors.explanation
                    ? errors.explanation
                    : 'Press Enter for new line'}
                  label="Explanation"
                  name="explanation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.explanation}
                  variant="outlined"
                />
                <Button
                  color="primary"
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Add Sample
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

AddSamplesModal.propTypes = {
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  questionId: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddSamplesModal;
