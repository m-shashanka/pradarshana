import * as React from 'react';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
//import ListItemText from '@mui/material/ListItemText';
//import ListItemAvatar from '@mui/material/ListItemAvatar';
import Ratings from "./Ratings"
import {assessmentService} from "../../service/test/AssessmentService"
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

export default function TakeSurvey({}) {
  const navigate = useNavigate();
  const [question, setQuestion] = React.useState([]);
  const [mcq, setMcq] = React.useState([]);
  const [subjectiveQuestion, setSubjectiveQuestion] = React.useState([]);
  const {testId} = useParams();
  const [feedback, setFeedback] = React.useState([]);
  const [feedbackNode, setFeedbackNode] = React.useState([]);
  const { user } = useAuth();
  function handleSubmit() {
    let response = [];

    for(let i=0; i<feedback.length; i++) response.push({
      "difficulty": feedback[i],
      "mcqId": null,
      "questionId": null,
      "subjectiveQuestionId": null,
      "studentId" : user.id,
      "note": feedbackNode[i]
    });

    for(let i=0; i<mcq.length; i++) {
      response[i]["mcqId"] = mcq[i]._id;
    }

    for(let i=0; i<question.length; i++) {
      response[i + mcq.length]["questionId"] = question[i]._id;
    }

    for(let i=0;i<subjectiveQuestion.length;i++){
      response[i+mcq.length+question.length]["subjectiveQuestionId"] = subjectiveQuestion[i]._id;
    }

    assessmentService.addFeedbacks(testId, {"feedbacks" : response})
    navigate("/");
  }

  React.useEffect(async () => {
    try{
      const hasGivenFeedbackResponse = await assessmentService.checkFeedbackGiven({testId, studentId : user.id});
      if(hasGivenFeedbackResponse.data.given){
        toast.error('You have already given the survey');
        navigate('/', { replace: true });
      }
      const response = await assessmentService.fetchCodingQuestionsForStudent(testId);
      
      const len = response.data.codingQuestions.length + response.data.mcqQuestions.length + response.data.subjectiveQuestions.length;
      let temp = [];
      setMcq(response.data.mcqQuestions);
      setQuestion(response.data.codingQuestions);
      setSubjectiveQuestion(response.data.subjectiveQuestions);
      for(let i=0; i < len; i++) {
        temp.push(0);
        feedbackNode.push("");
      }
  
      setFeedback(temp);
    }
    catch(error){
      toast.error('Attempt the test first for filling feedback');
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <h2 style={{textAlign: "center"}}>
          SURVEY
        </h2>
    {
      feedback.length ?([...mcq, ...question, ...subjectiveQuestion].map((element, ind) => {
        return (
            <>
              <ListItem sx={{padding: "10px"}}>
                <h3>{`${ind + 1}.  ${element.title}`}</h3>
              </ListItem>

               <TextField
                id="outlined-multiline-flexible"
                label="Feedback Note (Optional)"
                style={{width:"80vw"}}
                maxRows={4}
                type={"text"}
                value={feedbackNode[ind]}
                sx={{ input: { color: 'white' } }}
                onChange={(event) => {
                  setFeedbackNode(old => {
                      const temp = [...feedbackNode];
                      temp[ind] = event.target.value;
                      return temp;
                  })
                }}
              />
              <div style={{
                padding: "20px"
              }}>
                  <Ratings ind={ind} setFeedback={setFeedback} feedback={feedback} />
              </div>
            </>
        )
      })): (<></>)
    }

    <p></p>

    <div style={{textAlign: "center"}}>
      <Button onClick={() => {handleSubmit()}}>Submit</Button>
    </div>
    </List>
  );
}
