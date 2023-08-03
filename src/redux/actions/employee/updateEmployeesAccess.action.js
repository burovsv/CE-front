import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUpdateEmployeeAccess = {
  updateEmployeeAccess: { data: null, loading: false, error: null },
};

export const updateEmployeeAccess = createAsyncThunk('employee/updateEmployeeAccess', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/employee/access`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerUpdateEmployeeAccess = {
  [updateEmployeeAccess.pending]: (state) => {
    state.updateEmployeeAccess.data = null;
    state.updateEmployeeAccess.loading = true;
  },
  [updateEmployeeAccess.fulfilled]: (state, action) => {
    state.updateEmployeeAccess.loading = false;
    state.updateEmployeeAccess.data = action.payload;
    state.updateEmployeeAccess.error = null;
  },
  [updateEmployeeAccess.rejected]: (state, action) => {
    state.updateEmployeeAccess.loading = false;
    state.updateEmployeeAccess.error = action.payload;
  },
};
