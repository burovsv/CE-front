import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetMarks = {
  getMarks: { data: [], loading: false, error: null },
}

export const getMarks = createAsyncThunk('mark/list', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/mark/list`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetMarks = {
    [getMarks.pending]: (state) => {
      state.getMarks.loading = true;
    },
    [getMarks.fulfilled]: (state, action) => {
      state.getMarks.loading = false;
      state.getMarks.data = action.payload;
      state.getMarks.error = null;
    },
    [getMarks.rejected]: (state, action) => {
      state.getMarks.loading = false;
      state.getMarks.error = action.payload;
    },
  };