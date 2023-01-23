import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetPrePayment = {
  getPrePayment: { data: [], loading: false, error: null },
};

export const getPrePayment = createAsyncThunk('employee/getPrePayment', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/prepayment/list`, { params: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetPrePayment = {
  [getPrePayment.pending]: (state) => {
    state.getPrePayment.loading = true;
  },
  [getPrePayment.fulfilled]: (state, action) => {
    state.getPrePayment.loading = false;
    state.getPrePayment.data = action.payload.list;
    state.getPrePayment.pages = action.payload.pages;
    state.getPrePayment.error = null;
  },
  [getPrePayment.rejected]: (state, action) => {
    state.getPrePayment.loading = false;
    state.getPrePayment.error = action.payload;
  },
};
