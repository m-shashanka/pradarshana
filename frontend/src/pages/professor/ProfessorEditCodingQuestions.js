import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, CircularProgress } from '@material-ui/core';
import { assessmentService } from '../../service/test/AssessmentService';
import EditCodingQuestionSideBar from '../../views/codingAssessment/EditCodingQuestionSideBar';
import gtm from '../../lib/gtm';
import AddMcqQuestionForm from '../../components/assessment/AddMcqQuestionForm'

const CodingAssessment = () => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const { testId } = useParams();
  const [mcq, setMcq] = useState(null);
  const [subjectiveQuestions, setSubjectiveQuestions] = useState(null);
  const getCodingQuestions = async () => {
    setLoading(true);
    const response = await assessmentService.fetchCodingQuestions(testId);
    setQuestions(response.data.codingQuestions);
    setMcq(response.data.mcqQuestions);
    setSubjectiveQuestions(response.data.subjectiveQuestions);
    setLoading(false);
  };

  const handleAddSample = (questionId, sample) => {
    const newQuestions = questions.map((a) => (a._id === questionId ? { ...a, samples: [...a.samples, sample] } : a));
    setQuestions(newQuestions);
  };

  const handleDeleteSample = (questionId, sampleId) => {
    const newQuestions = questions.map((a) => (a._id === questionId ? { ...a, samples: a.samples.filter((s) => s._id !== sampleId) } : a));
    setQuestions(newQuestions);
  };

  const handleAddTestCase = (questionId, testCase) => {
    const newQuestions = questions.map((a) => (a._id === questionId ? { ...a, testCases: [...a.testCases, testCase] } : a));
    setQuestions(newQuestions);
  };

  const handleDeleteTestCase = (questionId, testCaseId) => {
    const newQuestions = questions.map((a) => (a._id === questionId ? { ...a, testCases: a.testCases.filter((s) => s._id !== testCaseId) } : a));
    setQuestions(newQuestions);
  };

  const handleTestCaseVisbilityChange = (questionId, testCaseId, hidden) => {
    const newQuestions = questions.map((a) => (a._id === questionId ? { ...a, testCases: a.testCases.map((t) => (t._id === testCaseId ? { ...t, hidden } : t)) } : a));
    setQuestions(newQuestions);
  };

  const handleEditQuestion = (questionId, question) => {
    const newQuestions = questions.map((a) => (a._id === questionId ? { ...a, ...question } : a));
    setQuestions(newQuestions);
  };

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    await getCodingQuestions();
  }, []);

  return (
    <Box>
      {loading
        ? (
          <Box
            sx={{ display: 'flex' }}
            alignItems="center"
            justifyContent="center"
            p={3}
            mt={4}
          >
            <CircularProgress />
          </Box>
        )
        : (
          <>
          <EditCodingQuestionSideBar
            questions={questions}
            testId={testId}
            mcq={mcq}
            subjectiveQuestions={subjectiveQuestions}
            handleAddSample={handleAddSample}
            handleDeleteSample={handleDeleteSample}
            handleAddTestCase={handleAddTestCase}
            handleDeleteTestCase={handleDeleteTestCase}
            handleTestCaseVisbilityChange={handleTestCaseVisbilityChange}
            handleEditQuestion={handleEditQuestion}
          />
          </>
        )}
    </Box>
  );
};

export default CodingAssessment;
