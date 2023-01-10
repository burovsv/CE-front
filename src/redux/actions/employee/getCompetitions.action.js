import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetCompetitions = {
  getCompetitions: { data: null, loading: false, error: null },
};

export const getCompetitions = createAsyncThunk('employee/getCompetitions', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/competition-list`, { params: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetCompetitions = {
  [getCompetitions.pending]: (state) => {
    state.getCompetitions.data = null;
    state.getCompetitions.loading = true;
  },
  [getCompetitions.fulfilled]: (state, action) => {
    state.getCompetitions.loading = false;
    state.getCompetitions.data = action.payload;
    state.getCompetitions.error = null;
  },
  [getCompetitions.rejected]: (state, action) => {
    state.getCompetitions.loading = false;
    state.getCompetitions.error = action.payload;
  },
};
