import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetEmployees = {
  getEmployeePositions: { data: [], loading: false, error: null },
};

export const getEmployeePositions = createAsyncThunk('employeePosition/getEmployeePositions', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`http://192.168.240.196/zup_pay/hs/Exch_LP/ListEmployees`, {})
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
    state.getEmployeePositions.data = action.payload.list;
    state.getEmployeePositions.pages = action.payload.pages;
    state.getEmployeePositions.error = null;
  },
  [getEmployeePositions.rejected]: (state, action) => {
    state.getEmployeePositions.loading = false;
    state.getEmployeePositions.error = action.payload;
  },
};