import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateLoginEmployee = {
  loginEmployee: { data: null, loading: false, error: null },
};

export const loginEmployee = createAsyncThunk('employee/loginEmployee', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/employee/login`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerLoginEmployee = {
  [loginEmployee.pending]: (state) => {
    state.loginEmployee.loading = true;
  },
  [loginEmployee.fulfilled]: (state, action) => {
    localStorage.setItem('token', action.payload?.token);
    state.loginEmployee.loading = false;
    state.loginEmployee.data = action.payload;
    state.loginEmployee.error = null;
  },
  [loginEmployee.rejected]: (state, action) => {
    state.loginEmployee.loading = false;
    state.loginEmployee.error = action.payload;
  },
};
