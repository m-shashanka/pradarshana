import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Button, Dialog, TextField, Typography, Autocomplete, Chip } from '@material-ui/core';
import { courseService } from '../../../service/course/CourseService';
import * as Yup from 'yup';
import { Formik } from 'formik';

const CreateAssignmentModal = (props) => {
  const { onApply, onClose, open, courseId, onAdd, ...other } = props;

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Formik
        initialValues={{
          title: '',
          startDate: '',
          dueDate: '',
          attempts: '',
          tags: [],
          totalTime: '',
        }}
        validationSchema={Yup
          .object()
          .shape({
            title: Yup.string().max(50).required(),
            startDate: Yup.string().required(),
            tags: Yup.array(),
            dueDate: Yup.string().required(),
            attempts: Yup.number().min(0).required(),
            totalTime: Yup.number().min(1).required().integer()
          })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { data } = await courseService.addAsssignment(courseId, values);
            if (data && data.success) {
              onAdd({
                id: data.id,
                ...values,
                deadline: values.dueDate,
                totalAttempts: values.attempts,
              });
              toast.success('Created Assignment!');
            }
            setSubmitting(false);
          } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
            setSubmitting(false);
          }
          if (onApply) {
            onApply();
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
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
                Create Assignment
              </Typography>
              <Box sx={{ mt: 3 }}>
                <TextField
                  FormHelperTextProps={{
                    sx: {
                      textAlign: 'right',
                      mr: 0
                    }
                  }}
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title
                    ? errors.title
                    : `${50 - values.title.length} characters left`}
                  label="Assignment Name"
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Assignment Name"
                  value={values.title}
                  variant="outlined"
                />
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={[]} // User can add any tags that he wants
                  freeSolo
                  name="tags"
                  value={values.tags}
                  onChange={(e, value) => setFieldValue('tags', value)}
                  renderTags={(value, getTagProps) => value.map((option, index) => (
                    <Chip
                      label={option}
                      color="primary"
                      {...getTagProps({ index })}
                    />
                  ))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      rows={2}
                      label="Tags"
                      placeholder="Enter Tags"
                      variant="outlined"
                      sx={{
                        mb: 3
                      }}
                    />
                  )}
                />
                <TextField
                  sx={{
                    mb: 3
                  }}
                  fullWidth
                  error={Boolean(touched.startDate && errors.startDate)}
                  helperText={touched.startDate && errors.startDate}
                  label="Start Date"
                  name="startDate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.startDate}
                  InputLabelProps={{
                    shrink: true
                  }}
                  placeholder="Enter Start Date"
                  type="datetime-local"
                  variant="outlined"
                />
                <TextField
                  sx={{
                    mb: 3
                  }}
                  error={Boolean(touched.dueDate && errors.dueDate)}
                  fullWidth
                  label="Deadline"
                  helperText={touched.dueDate && errors.dueDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="dueDate"
                  value={values.dueDate}
                  placeholder="Enter Start Date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  type="datetime-local"
                  variant="outlined"
                />
                <TextField
                  sx={{
                    mb: 3
                  }}
                  error={Boolean(touched.totalTime && errors.totalTime)}
                  fullWidth
                  label="Test time in minutes"
                  helperText={touched.totalTime && errors.totalTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="totalTime"
                  value={values.totalTime}
                  placeholder="Enter test time in minutes"
                  InputLabelProps={{
                    shrink: true
                  }}
                  type="number"
                  variant="outlined"
                  step={1}
                />
                <TextField
                  error={Boolean(touched.attempts && errors.attempts)}
                  sx={{
                    mb: 3
                  }}
                  fullWidth
                  label="Attempts"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.attempts}
                  helperText={touched.attempts && errors.attempts}
                  name="attempts"
                  placeholder="Enter number of attempts each student get"
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 0,
                      step: 1
                    }
                  }}
                  variant="outlined"
                />
                <Button
                  color="primary"
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Create Assignment
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

CreateAssignmentModal.propTypes = {
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default CreateAssignmentModal;
