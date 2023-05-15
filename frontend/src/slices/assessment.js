import { createSlice } from '@reduxjs/toolkit';
/*
* codingResults
* [{id: "", code: "", testcases: []}]
* */
const initialState = {
  codingResults: [],
  mcqs: [],
  subjectiveResults: []
};

const initResultsUtil = (state, { codingQuestions, mcqs, subjectiveQuestions }) => {
  state.codingResults = codingQuestions && codingQuestions
    .map(({ id, testCases, defaultCode }) => ({ id, code: defaultCode || '', testCases }));
  state.mcqs = mcqs && mcqs.map(({ id }) => ({ id }));
  state.subjectiveResults = subjectiveQuestions && subjectiveQuestions.map(({ id }) => ({ id }));
};

const updateCodingResultUtil = (state, { id, details }) => {
  state.codingResults = state.codingResults.map((result) => (result.id === id ? details : result));
};

const slice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    initResults(state, action) {
      initResultsUtil(state, action.payload);
    },
    updateCodingResult(state, action) {
      updateCodingResultUtil(state, action.payload);
    }
  }
});

export const { reducer } = slice;

export const initializeResults = (data) => (dispatch) => {
  dispatch(slice.actions.initResults(data));
};

export const updateCodingResult = (data) => (dispatch) => {
  dispatch(slice.actions.updateCodingResult(data));
};

export default slice;
