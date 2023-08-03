import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetEmployeeHiddenList = {
  getEmployeeHiddenList: { data: null, loading: false, error: null },
};

export const getEmployeeHiddenList = createAsyncThunk('employee/getEmployeeHiddenList', async (subdivisionId, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/employee-hidden`, {
      params: {
        subdivisionId,
      },
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetEmployeeHiddenList = {
  [getEmployeeHiddenList.pending]: (state) => {
    state.getEmployeeHiddenList.loading = true;
  },
  [getEmployeeHiddenList.fulfilled]: (state, action) => {
    state.getEmployeeHiddenList.loading = false;
    state.getEmployeeHiddenList.data = action.payload;
    state.getEmployeeHiddenList.error = null;
  },
  [getEmployeeHiddenList.rejected]: (state, action) => {
    state.getEmployeeHiddenList.loading = false;
    state.getEmployeeHiddenList.error = action.payload;
  },
};
