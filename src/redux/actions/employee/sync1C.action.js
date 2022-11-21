import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateSync1C = {
  sync1C: { data: [], loading: false, error: null },
};

export const sync1C = createAsyncThunk('employee/sync1C', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/global/sync`, {})
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerSync1C = {
  [sync1C.pending]: (state) => {
    state.sync1C.loading = true;
  },
  [sync1C.fulfilled]: (state, action) => {
    state.sync1C.loading = false;
    state.sync1C.data = action.payload;
    state.sync1C.error = null;
  },
  [sync1C.rejected]: (state, action) => {
    state.sync1C.loading = false;
    state.sync1C.error = action.payload;
  },
};
