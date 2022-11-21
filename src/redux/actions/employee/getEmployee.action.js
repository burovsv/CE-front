import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetEmployee = {
  getEmployee: { data: [], loading: false, error: null },
};

export const getEmployee = createAsyncThunk('employee/getEmployee', async ({ id }, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/employee/${id}`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetEmployee = {
  [getEmployee.pending]: (state) => {
    state.getEmployee.loading = true;
  },
  [getEmployee.fulfilled]: (state, action) => {
    state.getEmployee.loading = false;
    state.getEmployee.data = action.payload;
    state.getEmployee.error = null;
  },
  [getEmployee.rejected]: (state, action) => {
    state.getEmployee.loading = false;
    state.getEmployee.error = action.payload;
  },
};
