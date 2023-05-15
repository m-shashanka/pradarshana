import AceCodeEditor from "../../components/assessment/AceCodeEditor";
import React from 'react'
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@material-ui/core";
import { assessmentService } from "../../service/test/AssessmentService";
import * as Yup from "yup";
import { Formik } from "formik";
import QuillEditor from "../QuillEditor";
import { LANGS } from "../../constants";

const EditCodingQuestionDetailsModal = (props) => {
  const { onApply, onClose, open, questionId, onEdit, details, ...other } =
  props;
  console.log('details', details)
  const [code,setCode] = React.useState(details? details.codeTemplate : '');
  return (
    <Dialog maxWidth="lg" onClose={onClose} open={open} {...other}>
      <Formik
        initialValues={{
          title: details.title,
          description: details.description,
          inputFormat: details.inputFormat,
          outputFormat: details.outputFormat,
          codeTemplate: details? details.codeTemplate : '',
          lang: details.lang,
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().max(5000).required(),
          description: Yup.string().max(5000).required(),
          inputFormat: Yup.string().max(5000).required(),
          outputFormat: Yup.string().max(5000).required(),
          lang: Yup.string().max(5000).required(),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            values.codeTemplate = code;
            const { data } =
              await assessmentService.updateCodingQuestionDetails(
                questionId,
                values
              );
            if (data && data.success) {
              setStatus({ success: true });
              toast.success("Question created!");
              onEdit(questionId, values);
            }
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong! Please try again");
            setStatus({ success: false });
            setErrors({ submit: error.message });
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
          setFieldValue,
          touched,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="textPrimary"
                gutterBottom
                variant="h4"
              >
                Edit Details
              </Typography>
              <Box sx={{ mt: 3 }}>
                <TextField
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title}
                  label="Question Title"
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                  }}
                  value={values.title}
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
                  Question Description
                </Typography>
                <QuillEditor
                  onChange={(value) => setFieldValue("description", value)}
                  placeholder="Write a description for the question"
                  sx={{ height: 400 }}
                  value={values.description}
                />
                {touched.description && errors.description && (
                  <Box sx={{ mt: 2 }}>
                    <FormHelperText error>{errors.description}</FormHelperText>
                  </Box>
                )}
                <Typography
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    mt: 3,
                  }}
                  variant="subtitle2"
                >
                  Input Format
                </Typography>
                <QuillEditor
                  onChange={(value) => setFieldValue("inputFormat", value)}
                  placeholder="Specify input format"
                  sx={{ height: 400 }}
                  value={values.inputFormat}
                />
                {touched.inputFormat && errors.inputFormat && (
                  <Box sx={{ mt: 2 }}>
                    <FormHelperText error>{errors.inputFormat}</FormHelperText>
                  </Box>
                )}
                <Typography
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    mt: 3,
                  }}
                  variant="subtitle2"
                >
                  Output Format
                </Typography>
                <QuillEditor
                  onChange={(value) => setFieldValue("outputFormat", value)}
                  placeholder="Specify output format"
                  sx={{ height: 400 }}
                  value={values.outputFormat}
                />
                {touched.outputFormat && errors.outputFormat && (
                  <Box sx={{ mt: 2 }}>
                    <FormHelperText error>{errors.outputFormat}</FormHelperText>
                  </Box>
                )}
                <FormControl
                  fullWidth
                  margin="normal"
                  error={Boolean(touched.lang && errors.lang)}
                >
                  <InputLabel id="lang-select-label">Language</InputLabel>
                  <Select
                    name="lang"
                    labelId="lang-select-label"
                    value={values.lang}
                    label="Language"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                  >
                    {LANGS.map((lang) => (
                      <MenuItem value={lang.id}>{lang.name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.lang}</FormHelperText>
                </FormControl>
                <Typography
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    mt: 3,
                  }}
                  variant="subtitle2"
                >
                  Enter Code Template
                </Typography>
                <Stack sx={{ mb: 2 }}>
                  <AceCodeEditor
                    name="codeTemplate"
                    code={code}
                    onChange={(e) => {setCode(e)}}
                    onBlur={handleBlur}
                  />
                </Stack>
                <Button
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Update Details
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

EditCodingQuestionDetailsModal.propTypes = {
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  questionId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired,
};

export default EditCodingQuestionDetailsModal;
