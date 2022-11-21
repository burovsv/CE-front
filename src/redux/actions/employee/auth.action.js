import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateAuthEmployee = {
  authEmployee: { data: null, loading: false, error: null },
};

export const authEmployee = createAsyncThunk('employee/authEmployee', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/auth`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerAuthEmployee = {
  [authEmployee.pending]: (state) => {
    state.authEmployee.loading = true;
  },
  [authEmployee.fulfilled]: (state, action) => {
    state.authEmployee.loading = false;
    state.authEmployee.data = action.payload;
    state.authEmployee.error = null;
  },
  [authEmployee.rejected]: (state, action) => {
    localStorage.removeItem('token');
    state.authEmployee.data = null;
    state.authEmployee.loading = false;
    state.authEmployee.error = action.payload;
  },
};
