import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUpdateTesting = {
  updateTesting: { data: null, loading: false, error: null },
};

export const updateTesting = createAsyncThunk('testing/updateTesting', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/testing/update`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerUpdateTesting = {
  [updateTesting.pending]: (state) => {
    state.updateTesting.loading = true;
  },
  [updateTesting.fulfilled]: (state, action) => {
    state.updateTesting.loading = false;
    state.updateTesting.data = action.payload;
    state.updateTesting.error = null;
  },
  [updateTesting.rejected]: (state, action) => {
    state.updateTesting.loading = false;
    state.updateTesting.error = action.payload;
  },
};
