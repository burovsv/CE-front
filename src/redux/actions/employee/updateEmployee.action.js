import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUpdateEmployee = {
  updateEmployee: { data: null, loading: false, error: null },
};

export const updateEmployee = createAsyncThunk('employee/updateEmployee', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/employee/update`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerUpdateEmployee = {
  [updateEmployee.pending]: (state) => {
    state.updateEmployee.loading = true;
  },
  [updateEmployee.fulfilled]: (state, action) => {
    state.updateEmployee.loading = false;
    state.updateEmployee.data = action.payload;
    state.updateEmployee.error = null;
  },
  [updateEmployee.rejected]: (state, action) => {
    state.updateEmployee.loading = false;
    state.updateEmployee.error = action.payload;
  },
};
