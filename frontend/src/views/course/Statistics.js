import { useState, useEffect } from 'react';
import StatisticsTable from '../../components/dashboard/courses/StatisticsTable';
import { useParams } from 'react-router';
import { assessmentService } from '../../service/test/AssessmentService';
import findTimeTakenInMins from '../../utils/findTimeTakenInMins';
import TimePerStudentChart from '../../components/assessment/TimePerStudentChart';
import BarChartMinsOnY from '../../components/assessment/BarChartMinsOnY';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { apiConfig } from '../../config';

const Statistics = () => {
  const { testId } = useParams();
  const [details, setDetails] = useState([]);
  const [testInfo, setTestInfo] = useState(null);
  const [questions, setQuestions] = useState({});
  const [feedback, setFeedback] = useState([]);
  const [warningDetails, setWarningDetails] = useState([]);

  const getFinalAttemptTimeTaken = (details) => {
    const detailsMap = {}
    for (const detail of details) {
      if (detail.endTime) {
        if (detail.student._id in detailsMap) {
          if (detailsMap[detail.student._id].attempt < detail.attempt) {
            detailsMap[detail.student._id] = detail;
          }
        }
        else
          detailsMap[detail.student._id] = detail;
      }
    }
    return Object.values(detailsMap);
  }

  const getTimeTakenChartValue = (details) => {
    const data = [];
    const categories = [];
    for (const detail of details) {
      data.push(Math.floor(findTimeTakenInMins(detail.startTime, detail.endTime)));
      categories.push(detail.student.usn);
    }
    return {
      series: [{ name: 'Time Taken', data }],
      categories
    };
  }

  const calculateAverageTimePerQuestion = (details, questions) => {
    const questionAvg = {};
    for (const detail of details) {
      const tmp = [...detail.codingDetails];
      tmp.sort((a, b) => (new Date(a.time) === new Date(b.time) ? 0 : (new Date(a.time) < new Date(b.time) ? -1 : 1)))
      for (let index = 0; index < tmp.length; index++) {
        const element = tmp[index];
        if (element.questionId in questionAvg) {
          questionAvg[element.questionId] = {
            total: findTimeTakenInMins(index === 0 ? detail.startTime : tmp[index - 1].time, element.time) + questionAvg[element.questionId].total,
            n: questionAvg[element.questionId].n + 1
          }
        }
        else {
          questionAvg[element.questionId] = {
            total: findTimeTakenInMins(index === 0 ? detail.startTime : tmp[index - 1].time, element.time),
            n: 1
          }
        }
      }
    }
    const data = [];
    const categories = [];
    for (const [key, value] of Object.entries(questionAvg)) {
      const questionAvg = Math.floor(value.total / value.n);
      data.push(questionAvg)
      categories.push(questions.codingQuestions.find(x => x._id === key).title)
    }
    return {
      series: [{ name: 'Time Taken', data }],
      categories
    };
  }

  const calculateScorePerStudent = (details, questions) => {
    const maxMarksPerStudent = {};
    for (const detail of details) {
      let total = 0;
      let count = 0;
      for (const codingDetail of detail.codingDetails) {
        total += (codingDetail.passed ? codingDetail.passed.length : 0);
        count += questions.codingQuestions.find(x => x._id === codingDetail.questionId).testCases.length;
      }
      for (const mcqDetail of detail.mcqDetails) {
        total += (Number.parseInt(mcqDetail.selectedAnswer) === questions.mcqQuestions.find(x => x._id === mcqDetail.mcqId).answer) ? 1 : 0;
      }
      count += questions.mcqQuestions.length;
      if (count) {
        if (detail.student._id in maxMarksPerStudent) {
          if (maxMarksPerStudent[detail.student._id].marks < Math.floor((total / count) * 100))
            maxMarksPerStudent[detail.student._id] = {
              usn: maxMarksPerStudent[detail.student._id].usn,
              marks: Math.floor((total / count) * 100)
            }
        }
        else {
          maxMarksPerStudent[detail.student._id] = {
            usn: detail.student.name,
            marks: Math.floor((total / count) * 100)
          }
        }

      }
    }
    const data = [];
    const categories = [];
    for (const [key, value] of Object.entries(maxMarksPerStudent)) {
      data.push(value.marks)
      categories.push(value.usn)
    }

    return {
      series: [{ name: 'Score', data }],
      categories
    };

  }

  const getDifficultyPerQuestion = (feedbacks, questions) => {
    const feedbackPerQuestion = {};
    for (const feedback of feedbacks) {
      if (feedback.questionId) {
        if (feedback.questionId in feedbackPerQuestion) {
          feedbackPerQuestion[feedback.questionId] = {
            title: feedbackPerQuestion[feedback.questionId].title,
            total: feedbackPerQuestion[feedback.questionId].total + feedback.difficulty,
            count: feedbackPerQuestion[feedback.questionId].count + 1
          }
        }
        else {
          feedbackPerQuestion[feedback.questionId] = {
            title: questions.codingQuestions.find(x => x._id === feedback.questionId).title,
            total: feedback.difficulty,
            count: 1
          }
        }

      }
      if (feedback.mcqId) {
        if (feedback.mcqId in feedbackPerQuestion) {
          feedbackPerQuestion[feedback.mcqId] = {
            title: feedbackPerQuestion[feedback.mcqId].title,
            total: feedbackPerQuestion[feedback.mcqId].total + feedback.difficulty,
            count: feedbackPerQuestion[feedback.mcqId].count + 1
          }
        }
        else {
          feedbackPerQuestion[feedback.mcqId] = {
            title: questions.mcqQuestions.find(x => x._id === feedback.mcqId).title,
            total: feedback.difficulty,
            count: 1
          }
        }
      }
      if(feedback.subjectiveQuestionId){
        if (feedback.subjectiveQuestionId in feedbackPerQuestion) {
          feedbackPerQuestion[feedback.subjectiveQuestionId] = {
            title: feedbackPerQuestion[feedback.subjectiveQuestionId].title,
            total: feedbackPerQuestion[feedback.subjectiveQuestionId].total + feedback.difficulty,
            count: feedbackPerQuestion[feedback.subjectiveQuestionId].count + 1
          }
        }
        else {
          feedbackPerQuestion[feedback.subjectiveQuestionId] = {
            title: questions.subjectiveQuestions.find(x => x._id === feedback.subjectiveQuestionId).title,
            total: feedback.difficulty,
            count: 1
          }
        }
      }
    }
    const data = [];
    const categories = [];
    for (const [key, value] of Object.entries(feedbackPerQuestion)) {
      const questionAvg = Math.floor(value.total / value.count);
      data.push(questionAvg)
      categories.push(value.title)
    }

    return {
      series: [{ name: 'Difficulty', data }],
      categories
    };
  }

  useEffect(() => {
    async function fetchData() {
      const resp = await assessmentService.fetchDetails({ testId });
      const resp2 = await assessmentService.fetchCodingQuestions(testId);
      const resp3 = await assessmentService.fetchFeedbacks({testId});
      const resp4 = await assessmentService.fetchWarningDetails({testId});
      if (resp.data)
      {
        const details2 = resp.data.details;
        if(resp4.data){
          const warnings = resp4.data;
          for(const w of warnings){
            let student = details2.find(d => (d.student._id === w.studentId));
            w['name'] = student.student.name;
            w['usn'] = student.student.usn;
          }
          setWarningDetails(warnings);
        }
        for(const d of details2){
          for(const q of d.codingDetails){
            const hasFeedback = resp3.data.find(x => (x.studentId === d.student._id && x.questionId == q.questionId));
            let note = "-- No Feedback --";
            if(hasFeedback)
              note = hasFeedback.note;
            q['feedback'] = note;
          }
          for(const q of d.mcqDetails){
            const hasFeedback = resp3.data.find(x => (x.studentId === d.student._id && x.mcqId == q.mcqId));
            let note = "-- No Feedback --";
            if(hasFeedback)
              note = hasFeedback.note;
            q['feedback'] = note;
          }
          for(const q of d.simpleDetails){
            const hasFeedback = resp3.data.find(x => (x.studentId === d.student._id && x.subjectiveQuestionId == q.quesId));
            let note = "-- No Feedback --";
            if(hasFeedback)
              note = hasFeedback.note;
            q['feedback'] = note;
            const studentAns = q.answer;
            const expectedAns = resp2.data.subjectiveQuestions.find(x => x._id === q.quesId).expectedAnswer;
            let score = 0;
            if(studentAns)
              score = (await assessmentService.getScore({studentAns,expectedAns})).data.score;
            q['score'] = score;
          }
        }
        setDetails(details2);
        setTestInfo(resp.data.test);
      }
      if (resp2.data)
        setQuestions(resp2.data);
      if(resp3.data)
        setFeedback(resp3.data);
    }
    fetchData();
  }, [testId]);

  return (
    <>
      <Helmet>
        <title>Statistics</title>
      </Helmet>
      <StatisticsTable
        totalAttempts={testInfo? testInfo.totalAttempts : 0}
        details={details}
        questions={questions}
        testName={testInfo? testInfo.title : ''}
      />
      <TimePerStudentChart
        data={details ? getTimeTakenChartValue(getFinalAttemptTimeTaken(details)) : {}}
      />
      {
        (details && questions.codingQuestions) && (
          <BarChartMinsOnY
            data={calculateAverageTimePerQuestion(details, questions)}
            title={'Average time taken per question'}
            unit={'min'}
          />
        )
      }

      {
        (details && questions.codingQuestions) && (
          <BarChartMinsOnY
            data={calculateScorePerStudent(details, questions)}
            title={'Max percentace per student'}
            unit={'%'}
          />
        )
      }

      {(feedback.length) > 0 && (
        <BarChartMinsOnY
          data={getDifficultyPerQuestion(feedback, questions)}
          title={'Average difficulty per question'}
          unit={'⭐'}
        />
      )}

      <h1 style={{marginLeft: '30px'}}>Proctoring Details</h1>
      <Box sx={{ minWidth: 1200 }} style={{overflowX: 'auto'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                NAME
              </TableCell>
              <TableCell>
                USN
              </TableCell>
              <TableCell>
                IRIS
              </TableCell>
              <TableCell>
                VOICE
              </TableCell>
              <TableCell>
                PHONE
              </TableCell>
              <TableCell>
                NO PERSON
              </TableCell>
              <TableCell>
                MULTIPLE PERSONS
              </TableCell>
              <TableCell>
                FACE NOT RECOGNIZED
              </TableCell>
              <TableCell>
                SCREENSHOTS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {warningDetails.map(warning => (
            <TableRow key={warning.studentId} >
              <TableCell>
                {warning.name}
              </TableCell>
              <TableCell>
                {warning.usn}
              </TableCell>
              <TableCell>
                {warning.LOOKING_AWAY_FROM_SCREEN}
              </TableCell>
              <TableCell>
                {warning.VOICE_DETECTED}
              </TableCell>
              <TableCell>
                {warning.PHONE_DETECTED}
              </TableCell>
              <TableCell>
                {warning.NO_PERSON_DETECTED}
              </TableCell>
              <TableCell>
                {warning.MULTIPLE_PERSONS_DETECTED}
              </TableCell>
              <TableCell>
                {warning.FACE_NOT_RECOGNIZED}
              </TableCell>
              <TableCell>
                <a style={{textDecoration: 'none', color: 'blue'}} 
                href={`${apiConfig.baseUrl}/uploads/${testId}/screenshots?usn=${warning.usn}`} target='_blank'>Link</a>
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};


export default Statistics;
