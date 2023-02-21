import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetEmployeePositions = {
  getEmployeePositions: { data: [], loading: false, error: null },
};

export const getEmployeePositions = createAsyncThunk('employeePositions/list', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/employeePositions/list`, {})
    .then((res) => {
        console.log('data', res.data);
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
        console.log('error', res.response.data);
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetEmployeePositions = {
  [getEmployeePositions.pending]: (state) => {
    state.getEmployeePositions.loading = true;
  },
  [getEmployeePositions.fulfilled]: (state, action) => {
    state.getEmployeePositions.loading = false;
    state.getEmployeePositions.data = action.payload;
    state.getEmployeePositions.error = null;
  },
  [getEmployeePositions.rejected]: (state, action) => {
    state.getEmployeePositions.loading = false;
    state.getEmployeePositions.error = action.payload;
  },
};