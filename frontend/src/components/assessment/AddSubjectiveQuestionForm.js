import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {React, useState} from 'react';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  Alert
} from '@material-ui/core';
import QuillEditor from '../QuillEditor';
import { assessmentService } from '../../service/test/AssessmentService';
import AddIcon from '@material-ui/icons/Add';


const AddSubjectiveQuestionForm = ({titles="", expectedAnswers="", descriptions="", quesId = undefined}) => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [expectedAnswer, setexpectedAnswer] = useState(expectedAnswers);
  const [desc, setDesc] = useState(descriptions);
  const [title, setTitle] = useState(titles);
  const location = useLocation();

  return (
    <Formik
      initialValues={{
        title: '',
      }}
      validationSchema={Yup.object().shape({
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
           values.title = title;
           values.expectedAnswer = expectedAnswer;
           values.description = desc;
           if(quesId) 
            values.quesId = quesId;
          const { data } = await assessmentService.addSubjectiveQuestion(testId, values);
          if (data && data.success) {
            setStatus({ success: true });
            toast.success('Subjective Question created!');
            if(location.pathname.includes("add-subjective-question"))
              navigate('../', { replace: true });
            else
              navigate(0, { replace: true });
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
                    error={Boolean(touched.title && errors.title)}
                    fullWidth
                    helperText={touched.title && errors.title}
                    label="Question Title"
                    name="title"
                    onBlur={handleBlur}
                    onChange={event => setTitle(event.target.value)}
                    sx={{
                      mb: 2,
                    }}
                    value={title}
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
                    onChange={(value) => setDesc(value)}
                    placeholder="Write a description for the question"
                    sx={{ height: 400 }}
                      value={desc}
                  />
                  {touched.description && errors.description && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.description}
                      </FormHelperText>
                    </Box>
                  )} 

                    <p></p>

                    <Typography
                    color="textSecondary"
                    sx={{
                      mb: 2,
                      mt: 3,
                    }}
                    variant="subtitle2"
                  >
                    Expected Answer
                  </Typography>
                  <QuillEditor
                    onChange={(value) => setexpectedAnswer(value)}
                    placeholder="Write the expected answer for the question"
                    sx={{ height: 400 }}
                    value={expectedAnswer}
                    disableToolbar
                  />
                  {touched.expectedAnswer && errors.expectedAnswer && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.expectedAnswer}
                      </FormHelperText>
                    </Box>
                  )} 

                </CardContent>
              </Card>
              <Box sx={{ mt: 3 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Add Question
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AddSubjectiveQuestionForm;

// import React from 'react'
// import { useNavigate, useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   FormHelperText,
//   Grid,
//   TextField,
//   Typography,
// } from '@material-ui/core';
// import QuillEditor from '../QuillEditor';
// import { assessmentService } from '../../service/test/AssessmentService';

// const AddSubjectiveQuestionForm = () => {
//   const navigate = useNavigate();
//   const { testId } = useParams();
//   return (
//     <Formik
//       initialValues={{
//         title: '',
//         description: '',
//         expectedAnswer: ''
//       }}
//       validationSchema={Yup.object().shape({
//         title: Yup.string().max(5000).required(),
//         description: Yup.string().max(5000).required(),
//         expectedAnswer: Yup.string().required()
//       })}
//       onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//         try {
//           const { data } = await assessmentService.addSubjectiveQuestion(testId, values);
//           if (data && data.success) {
//             setStatus({ success: true });
//             toast.success('Subjective Question created!');
//             navigate('../', { replace: true });
//           }
//         } catch (error) {
//           console.error(error);
//           toast.error('Something went wrong! Please try again');
//           setStatus({ success: false });
//           setErrors({ submit: error.message });
//         } finally {
//           setSubmitting(false);
//         }
//       }}
//     >
//       {({
//         errors,
//         handleBlur,
//         handleChange,
//         handleSubmit,
//         isSubmitting,
//         setFieldValue,
//         touched,
//         values,
//       }) => (
//         <form
//           onSubmit={handleSubmit}
//         >
//           <Grid
//             container
//             spacing={3}
//           >
//             <Grid
//               item
//               xs={12}
//             >
//               <Card>
//                 <CardContent>
//                   <TextField
//                     error={Boolean(touched.title && errors.title)}
//                     fullWidth
//                     helperText={touched.title && errors.title}
//                     label="Question Title"
//                     name="title"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     sx={{
//                       mb: 2,
//                     }}
//                     value={values.title}
//                     variant="outlined"
//                   />
//                   <Typography
//                     color="textSecondary"
//                     sx={{
//                       mb: 2,
//                       mt: 3,
//                     }}
//                     variant="subtitle2"
//                   >
//                     Question Description
//                   </Typography>
//                   <QuillEditor
//                     onChange={(value) => setFieldValue('description', value)}
//                     placeholder="Write a description for the question"
//                     sx={{ height: 400 }}
//                     value={values.description}
//                   />
//                   {touched.description && errors.description && (
//                     <Box sx={{ mt: 2 }}>
//                       <FormHelperText error>
//                         {errors.description}
//                       </FormHelperText>
//                     </Box>
//                   )}
//                    <Typography
//                     color="textSecondary"
//                     sx={{
//                       mb: 2,
//                       mt: 3,
//                     }}
//                     variant="subtitle2"
//                   >
//                     Expected Answer
//                   </Typography>
//                   <QuillEditor
//                     onChange={(value) => setFieldValue('expectedAnswer', value)}
//                     placeholder="Write the expected answer for the question"
//                     sx={{ height: 400 }}
//                     value={values.expectedAnswer}
//                   />
//                   {touched.expectedAnswer && errors.expectedAnswer && (
//                     <Box sx={{ mt: 2 }}>
//                       <FormHelperText error>
//                         {errors.expectedAnswer}
//                       </FormHelperText>
//                     </Box>
//                   )}
//                 </CardContent>
//               </Card>
//               <Box sx={{ mt: 3 }}>
//                 <Button
//                   color="primary"
//                   disabled={isSubmitting}
//                   type="submit"
//                   variant="contained"
//                 >
//                   Add Question
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       )}
//     </Formik>
//   );
// };

// export default AddSubjectiveQuestionForm;
