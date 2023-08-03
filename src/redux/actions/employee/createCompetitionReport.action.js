import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateCompetitionReport = {
  createCompetitionReport: { data: null, loading: false, error: null },
};

export const createCompetitionReport = createAsyncThunk('employee/createCompetitionReport', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/competition-report`, { params: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerCreateCompetitionReport = {
  [createCompetitionReport.pending]: (state) => {
    state.createCompetitionReport.data = null;
    state.createCompetitionReport.loading = true;
  },
  [createCompetitionReport.fulfilled]: (state, action) => {
    state.createCompetitionReport.loading = false;
    state.createCompetitionReport.data = action.payload;
    state.createCompetitionReport.error = null;
  },
  [createCompetitionReport.rejected]: (state, action) => {
    state.createCompetitionReport.loading = false;
    state.createCompetitionReport.error = action.payload;
  },
};
