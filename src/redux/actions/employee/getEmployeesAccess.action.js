import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetEmployeeAccess = {
  getEmployeeAccess: { data: [], loading: false, error: null },
};

export const getEmployeeAccess = createAsyncThunk('employee/getEmployeeAccess', async (type, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/employee/access`, { params: { type } })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetEmployeeAccess = {
  [getEmployeeAccess.pending]: (state) => {
    state.getEmployeeAccess.data = [];
    state.getEmployeeAccess.loading = true;
  },
  [getEmployeeAccess.fulfilled]: (state, action) => {
    state.getEmployeeAccess.loading = false;
    state.getEmployeeAccess.data = action.payload;
    state.getEmployeeAccess.error = null;
  },
  [getEmployeeAccess.rejected]: (state, action) => {
    state.getEmployeeAccess.loading = false;
    state.getEmployeeAccess.error = action.payload;
  },
};
