import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetEmployeeCompetitions = {
  getEmployeeCompetitions: { data: null, loading: false, error: null },
};

export const getEmployeeCompetitions = createAsyncThunk('employee/getEmployeeCompetitions', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/competition-list-employee`, { params: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetEmployeeCompetitions = {
  [getEmployeeCompetitions.pending]: (state) => {
    state.getEmployeeCompetitions.loading = true;
  },
  [getEmployeeCompetitions.fulfilled]: (state, action) => {
    state.getEmployeeCompetitions.loading = false;
    state.getEmployeeCompetitions.data = action.payload;
    state.getEmployeeCompetitions.error = null;
  },
  [getEmployeeCompetitions.rejected]: (state, action) => {
    state.getEmployeeCompetitions.loading = false;
    state.getEmployeeCompetitions.error = action.payload;
  },
};
