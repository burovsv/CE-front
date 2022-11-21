import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateTesting = {
  createTesting: { data: null, loading: false, error: null },
};

export const createTesting = createAsyncThunk('testing/createTesting', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/testing/create`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerCreateTesting = {
  [createTesting.pending]: (state) => {
    state.createTesting.loading = true;
  },
  [createTesting.fulfilled]: (state, action) => {
    state.createTesting.loading = false;
    state.createTesting.data = action.payload;
    state.createTesting.error = null;
  },
  [createTesting.rejected]: (state, action) => {
    state.createTesting.loading = false;
    state.createTesting.error = action.payload;
  },
};
