import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateCreateTestingFilter = {
  createTestingFilter: { data: null, loading: false, error: null },
};

export const createTestingFilter = createAsyncThunk('testingFilter/createTestingFilter', async ({ name }, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/testing-filter/create`, { name })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerCreateTestingFilter = {
  [createTestingFilter.pending]: (state) => {
    state.createTestingFilter.loading = true;
  },
  [createTestingFilter.fulfilled]: (state, action) => {
    state.createTestingFilter.loading = false;
    state.createTestingFilter.data = action.payload;
    state.createTestingFilter.error = null;
  },
  [createTestingFilter.rejected]: (state, action) => {
    state.createTestingFilter.loading = false;
    state.createTestingFilter.error = action.payload;
  },
};
