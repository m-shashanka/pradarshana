//import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  //Box,
  //Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  //TextField,
  Button
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import findTimeTaken from '../../../utils/findTimeTaken';


const StatisticsQuestionTable = (props) => {
  const { questionsDetails, type, questions, handleShowCode, startTime } = props;

  const getTimeTaken = (id) => {
    const tmp = [...questionsDetails];
    tmp.sort((a,b) => (new Date(a.time) === new Date(b.time)? 0:(new Date(a.time) < new Date(b.time)? -1:1)))
    for (let index = 0; index < tmp.length; index++) {
      const element = tmp[index];
      if(element._id === id)
      { 
        if(index === 0)
        return findTimeTaken(startTime, element.time)
      return findTimeTaken(tmp[index-1].time, element.time)
      }
    }
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Question
            </TableCell>
            <TableCell>
              {type != 'subjective' ? 'Correct' : 'Score'}
            </TableCell>
            {
              type === 'coding' &&
              (
                <TableCell>
                  Time taken
                </TableCell>
              )
            }
            {
              type === 'coding' &&
              (
                <TableCell>
                  Code
                </TableCell>
              )
            }
            <TableCell>
              Feedback
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            questionsDetails.map((detail) => (
              <TableRow
                key={detail._id}>
                <TableCell>
                  {questions.find((x) => x._id === (type === 'coding' ? detail.questionId : (type === 'mcq' ? detail.mcqId : detail.quesId))).title}
                </TableCell>
                <TableCell>
                  {type === 'coding' ? `${detail.passed.length}/${questions.find((x) => x._id === detail.questionId).testCases.length}` : (type === 'mcq' ? `${Number.parseInt(detail.selectedAnswer) === questions.find((x) => x._id === detail.mcqId).answer ? 1 : 0}/1` : detail.score*100)}
                </TableCell>
                {
                  type === 'coding' &&
                  (
                    <TableCell>
                      {getTimeTaken(detail._id)}
                    </TableCell>
                  )
                }
                {
                  type === 'coding' &&
                  (
                    <TableCell>
                      <Button
                            color="primary"
                            endIcon={<ArrowRightIcon fontSize="small" />}
                            variant="text"
                            onClick={()=>{
                              handleShowCode(detail.code)
                            }}
                          >
                            Show Code
                          </Button>
                    </TableCell>
                  )
                }
                <TableCell>
                  {detail.feedback}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
     
    </>
  );
};

StatisticsQuestionTable.propTypes = {
  questionsDetails: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired,
  handleShowCode: PropTypes.func.isRequired,
  startTime: PropTypes.string.isRequired
};

export default StatisticsQuestionTable;
