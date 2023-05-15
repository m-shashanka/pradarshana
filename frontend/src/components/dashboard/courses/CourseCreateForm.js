import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import FileDropzone from '../../FileDropzone';
import QuillEditor from '../../QuillEditor';
import { courseService } from '../../../service/course/CourseService';

const CourseCreateForm = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  return (
    <Formik
      initialValues={{
        courseId: '',
        description: '',
        name: ''
      }}
      validationSchema={Yup.object().shape({
        courseId: Yup.string().max(5000).required(),
        description: Yup.string().max(5000),
        name: Yup.string().max(255).required(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const formData = new FormData();
          formData.append('data', JSON.stringify(values));
          formData.append('file', files[0]);
          const { data } = await courseService.addCourse(formData);
          if (data) {
            setStatus({ success: true });
            toast.success('Course created!');
            navigate('/dashboard/professor/courses');
          }
        } catch (error) {
          console.error(error);
          toast.error('Something went wrong! Please try again');
          setStatus({ success: false });
          setErrors({ submit: error.message });
        } finally {
          setSubmitting(false);
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
        values,
      }) => (
        <form
          onSubmit={handleSubmit}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
            >
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.courseId && errors.courseId)}
                    fullWidth
                    helperText={touched.courseId && errors.courseId}
                    label="Course Code"
                    name="courseId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{
                      mb: 2,
                    }}
                    value={values.courseId}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Course Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
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
                    Course Description
                  </Typography>
                  <QuillEditor
                    onChange={(value) => setFieldValue('description', value)}
                    placeholder="Write a description for the course"
                    sx={{ height: 400 }}
                    value={values.description}
                  />
                  {touched.description && errors.description && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.description}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="Upload Image" />
                  <CardContent>
                    <FileDropzone
                      accept="image/*"
                      maxFiles={1}
                      files={files}
                      maxUpload={1}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                    />
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Create Course
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default CourseCreateForm;
