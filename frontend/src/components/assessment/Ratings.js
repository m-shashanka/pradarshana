import * as React from 'react';
import { Rating, Box } from '@material-ui/core';
import { Star } from '@material-ui/icons';

const labels = {
  1: 'Very Easy',
  2: 'Easy',
  3: 'Ok',
  4: 'Good',
  5: 'Difficult',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function Ratings({ind, setFeedback, feedback}) {
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);


  return (  
    <Box
      sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Rating
        name={`hover-feedback-${ind}`}
        value={value}
        precision={1}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(oldValue => {
              const temp = [...feedback];
              temp[ind] = newValue;
              setFeedback(temp);
              console.log(temp);
              console.log(ind);
            return newValue
          });
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
    </Box>
  );
}
