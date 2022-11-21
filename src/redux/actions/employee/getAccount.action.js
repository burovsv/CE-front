import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAccount = {
  getAccount: { data: null, loading: false, error: null },
};

export const getAccount = createAsyncThunk('employee/getAccount', async ({ idService, date }, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/account`, {
      params: {
        idService,
        date,
      },
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetAccount = {
  [getAccount.pending]: (state) => {
    state.getAccount.loading = true;
  },
  [getAccount.fulfilled]: (state, action) => {
    state.getAccount.loading = false;
    state.getAccount.data = action.payload;
    state.getAccount.error = null;
  },
  [getAccount.rejected]: (state, action) => {
    state.getAccount.loading = false;
    state.getAccount.error = action.payload;
  },
};
