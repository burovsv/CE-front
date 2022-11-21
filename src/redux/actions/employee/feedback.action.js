import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateFeedbackEmployee = {
  feedbackEmployee: { data: null, loading: false, error: null },
};

export const feedbackEmployee = createAsyncThunk('employee/feedbackEmployee', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/employee/feedback`, { message: data.message, anonym: data.anonym })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerFeedbackEmployee = {
  [feedbackEmployee.pending]: (state) => {
    state.feedbackEmployee.loading = true;
  },
  [feedbackEmployee.fulfilled]: (state, action) => {
    state.feedbackEmployee.loading = false;
    state.feedbackEmployee.data = action.payload;
    state.feedbackEmployee.error = null;
  },
  [feedbackEmployee.rejected]: (state, action) => {
    state.feedbackEmployee.loading = false;
    state.feedbackEmployee.error = action.payload;
  },
};
