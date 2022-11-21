import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateDownloadEmployees = {
  downloadEmployees: { data: null, loading: false, error: null },
};

export const downloadEmployees = createAsyncThunk('employee/downloadEmployees', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/employee/download`, { params: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerDownloadEmployees = {
  [downloadEmployees.pending]: (state) => {
    state.downloadEmployees.loading = true;
  },
  [downloadEmployees.fulfilled]: (state, action) => {
    state.downloadEmployees.loading = false;
    state.downloadEmployees.data = action.payload;
    state.downloadEmployees.error = null;
  },
  [downloadEmployees.rejected]: (state, action) => {
    state.downloadEmployees.loading = false;
    state.downloadEmployees.error = action.payload;
  },
};
