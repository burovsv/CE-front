import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetEmployees = {
  getEmployees: { data: [], loading: false, error: null },
};

export const getEmployees = createAsyncThunk('employee/getEmployees', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/employee/list`, { params: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetEmployees = {
  [getEmployees.pending]: (state) => {
    state.getEmployees.loading = true;
  },
  [getEmployees.fulfilled]: (state, action) => {
    state.getEmployees.loading = false;
    state.getEmployees.data = action.payload.list;
    state.getEmployees.pages = action.payload.pages;
    state.getEmployees.error = null;
  },
  [getEmployees.rejected]: (state, action) => {
    state.getEmployees.loading = false;
    state.getEmployees.error = action.payload;
  },
};
