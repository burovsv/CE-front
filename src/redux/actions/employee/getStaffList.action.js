import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetStaffList = {
  getStaffList: { data: null, loading: false, error: null },
};

export const getStaffList = createAsyncThunk('employee/getStaffList', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/staff`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetStaffList = {
  [getStaffList.pending]: (state) => {
    state.getStaffList.loading = true;
  },
  [getStaffList.fulfilled]: (state, action) => {
    state.getStaffList.loading = false;
    state.getStaffList.data = action.payload;
    state.getStaffList.error = null;
  },
  [getStaffList.rejected]: (state, action) => {
    state.getStaffList.loading = false;
    state.getStaffList.error = action.payload;
  },
};
