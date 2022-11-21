import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateDeleteTesting = {
  deleteTesting: { data: null, loading: false, error: null },
};

export const deleteTesting = createAsyncThunk('testing/deleteTesting', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/testing/delete`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerDeleteTesting = {
  [deleteTesting.pending]: (state) => {
    state.deleteTesting.loading = true;
  },
  [deleteTesting.fulfilled]: (state, action) => {
    state.deleteTesting.loading = false;
    state.deleteTesting.data = action.payload;
    state.deleteTesting.error = null;
  },
  [deleteTesting.rejected]: (state, action) => {
    state.deleteTesting.loading = false;
    state.deleteTesting.error = action.payload;
  },
};
