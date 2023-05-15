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
 // FormControl,
//InputLabel,
//Select,
//MenuItem,
  Alert
} from '@material-ui/core';
import QuillEditor from '../QuillEditor';
import { assessmentService } from '../../service/test/AssessmentService';
//import { LANGS } from '../../constants';
import AddIcon from '@material-ui/icons/Add';


const AddMcqQuestionForm = ({testIds = undefined, optionss = [], titles="", answers=0, descriptions="", mcqId = undefined}) => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [options, setOptions] = useState(optionss);
  const [answer, setAnswer] = useState(answers);
  const [desc, setDesc] = useState(descriptions);
  const [title, setTitle] = useState(titles);
  const [currentOption, setCurrentOption] = useState("");
  const location = useLocation();
  
  const addOptions = (event) => {
    if(currentOption.length <= 0)
        return;

    setOptions([...options, currentOption]);

  }

  const removeOption = (index) => {
    if(index < 0 || index >= options.length)
        return;

      const temp = [...options];
      temp.splice(index, 1);

      setOptions(temp);

  }
  return (
    <Formik
      initialValues={{
        title: '',
        options: []
      }}
      validationSchema={Yup.object().shape({
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {

           values.options = options; 
           values.title = title;
           values.answer = answer;
           values.description = desc;
           if(mcqId) 
            values.mcqId = mcqId;
          console.log(values);
          const { data } = await assessmentService.addMcqs(testId, values);
          if (data && data.success) {
            setStatus({ success: true });
            toast.success('Question created!');
            if(location.pathname.includes("add-mcq-question"))
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

                  
                    {/*validation needs to be done*/}

                 

                    <div style={{display: "flex"}} >

                      <TextField
                      fullWidth
                      helperText={touched.title && errors.title}
                      label="Add Option"
                      value={currentOption}
                      onBlur={handleBlur}
                      sx={{
                        mb: 2,
                      }}
                      style={{width: "80vw"}}

                      onChange={(event) => setCurrentOption(event.target.value)}
                      variant="outlined"
                    />

                    <p></p>

                    <Button
                      color="primary"
                      startIcon={<AddIcon fontSize="small" />}
                      onClick={addOptions}
                      sx={{ mt: 1 }}
                
                      style={{width: "20vw", transform: "scale(.8)", position: "relative", "bottom": "10px"}}
                    >
                      Add Options
                    </Button>

                    </div>
                 

                 {
                   options.map((each, index) => {
                      return (
                        <>
                          <Alert

                            action={
                                <Button  onClick={() => removeOption(index)} size="small">
                                  Remove
                                </Button>
                              }
                            sx={{ mb: 2 }}
                          >
                            {`${index + 1})  ${each}`}
                          </Alert>
                          <p> </p>
                        </>
                        )
                   })
                 }

                    


                  <p style={{paddingTop: "10px"}}></p>


                  <TextField
                    label="Add Answer"
                    value={answer}
                    onBlur={handleBlur}
                    sx={{
                      mb: 2,
                    }}
                    onChange={(e) => setAnswer(e.target.value)}
                    variant="outlined"
                  />

                    <p></p>




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

export default AddMcqQuestionForm;
