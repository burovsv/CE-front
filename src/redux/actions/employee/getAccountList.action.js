import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAccountList = {
  getAccountList: { data: null, loading: false, error: null },
};

export const getAccountList = createAsyncThunk('employee/getAccountList', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/account-list`, { params: { subdivisionId: data } })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetAccountList = {
  [getAccountList.pending]: (state) => {
    state.getAccountList.loading = true;
  },
  [getAccountList.fulfilled]: (state, action) => {
    state.getAccountList.loading = false;
    state.getAccountList.data = action.payload;
    state.getAccountList.error = null;
  },
  [getAccountList.rejected]: (state, action) => {
    state.getAccountList.loading = false;
    state.getAccountList.error = action.payload;
  },
};
