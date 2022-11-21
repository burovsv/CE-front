import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateDeleteEmployee = {
  deleteEmployee: { data: [], loading: false, error: null },
};

export const deleteEmployee = createAsyncThunk('employee/deleteEmployee', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/employee/delete`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerDeleteEmployee = {
  [deleteEmployee.pending]: (state) => {
    state.deleteEmployee.loading = true;
  },
  [deleteEmployee.fulfilled]: (state, action) => {
    state.deleteEmployee.loading = false;
    state.deleteEmployee.data = action.payload;
    state.deleteEmployee.error = null;
  },
  [deleteEmployee.rejected]: (state, action) => {
    state.deleteEmployee.loading = false;
    state.deleteEmployee.error = action.payload;
  },
};
