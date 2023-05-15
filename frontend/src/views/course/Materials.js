import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@material-ui/core';
import FileDropzone from '../../components/FileDropzone';
import { MaterialsTable } from '../../components/dashboard/courses';
import { courseService } from '../../service/course/CourseService';

const Materials = (props) => {
  const { materials, isEditable, courseId, onAdd } = props;
  // const navigate = useNavigate();
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
    <>
      <MaterialsTable
        materials={materials}
      />
      {
        isEditable && (
          <Formik
            initialValues={{
              courseId,
              name: '',
            }}
            validationSchema={Yup.object().shape({
              courseId: Yup.string().max(5000).required(),
              name: Yup.string().max(5000).required(),
            })}
            onSubmit={async (values, { setStatus, setErrors, setSubmitting }) => {
              try {
                const formData = new FormData();
                formData.append('data', JSON.stringify(values));
                formData.append('file', files[0]);
                const { data } = await courseService.addMaterial(formData);
                if (data && data._id) {
                  onAdd(data);
                  setStatus({ success: true });
                  toast.success('Material Added!');
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
                    <Box sx={{ mt: 3 }}>
                      <Card>
                        <CardHeader title="Upload Material" />
                        <CardContent>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name}
                            label="Name"
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            sx={{
                              mb: 2,
                            }}
                            value={values.name}
                            variant="outlined"
                          />
                          <FileDropzone
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
                        Add Material
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        )
      }
    </>
  );
};

Materials.propTypes = {
  materials: PropTypes.array.isRequired,
  isEditable: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  onAdd: PropTypes.func
};

export default Materials;
