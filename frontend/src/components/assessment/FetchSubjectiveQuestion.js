import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import Markdown from 'react-markdown/with-html';
import { experimentalStyled } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import QuillEditor from '../QuillEditor';
import {assessmentService} from "../../service/test/AssessmentService";

// 
const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));
const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2)
  }
}));


export default function FetchSubjectiveQuestion({ques, detailsId}) {

  const [ans, setAns] = React.useState("");


  React.useEffect(() => {
    if(localStorage.getItem(ques._id)) {
      setAns(localStorage.getItem(ques._id));
    }
  }, []);

  const submitAns = async () => {
    await assessmentService.submitSubjective(ans, ques._id, detailsId);
    localStorage.setItem(ques._id, ans);
  }

  return (
    <FormControl fullWidth >
     <Div>{ques.title}</Div>
      <FormLabel id="demo-radio-buttons-group-label">
            <MarkdownWrapper>
              <Markdown
                source={ques.description}
                allowDangerousHtml
              />
            </MarkdownWrapper>
      </FormLabel>
      <Typography
        color="textSecondary"
        sx={{
            mb: 2,
            mt: 3,
        }}
        variant="subtitle2"
        >
            Your Answer
        </Typography>
        <QuillEditor
            onChange={(value) => setAns(value)}
            placeholder="Write your answer here"
            sx={{ height: 400 }}
            value={ans}
            disableToolbar
        />
      <Button onClick={() => submitAns()}>Submit</Button>
    </FormControl>

  );
}
