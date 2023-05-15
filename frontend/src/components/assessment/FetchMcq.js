import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import Markdown from 'react-markdown/with-html';
import { experimentalStyled } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
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


export default function FetchMcq({mcq, detailsId}) {

  const [ans, setAns] = React.useState(null);


  React.useEffect(() => {
    if(localStorage.getItem(mcq._id)) {
      setAns(+localStorage.getItem(mcq._id));
    }
  }, []);
  const submitMcq = async () => {
    await assessmentService.submitMcq(ans, mcq._id, detailsId);
    localStorage.setItem(mcq._id, ans);
  }

  return (
    <FormControl>
     <Div>{mcq.title}</Div>

      <FormLabel id="demo-radio-buttons-group-label">
        
            <MarkdownWrapper>
              <Markdown
                source={mcq.description}
                allowDangerousHtml
              />
            </MarkdownWrapper>
      </FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        value={ans && ans-1}
      > 

      {

        mcq.options.map((each, index) => {
          return (
            <FormControlLabel 
            onClick={() => {  
              setAns(index + 1)
            }} key={index.toString()} value={index} control={<Radio />} label={each} />   
          );
        })
      }

      <Button onClick={() => submitMcq()}>Submit</Button>
      </RadioGroup>
    </FormControl>

  );
}
