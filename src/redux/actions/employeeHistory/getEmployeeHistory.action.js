import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetEmployeeHistory = {
  getEmployeeHistory: { data: null, loading: false, error: null },
};

export const getEmployeeHistory = createAsyncThunk('employee/getEmployeeHistory', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/employee-history`, {})
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetEmployeeHistory = {
  [getEmployeeHistory.pending]: (state) => {
    state.getEmployeeHistory.loading = true;
  },
  [getEmployeeHistory.fulfilled]: (state, action) => {
    state.getEmployeeHistory.loading = false;
    state.getEmployeeHistory.data = action.payload;
    state.getEmployeeHistory.error = null;
  },
  [getEmployeeHistory.rejected]: (state, action) => {
    state.getEmployeeHistory.loading = false;
    state.getEmployeeHistory.error = action.payload;
  },
};
