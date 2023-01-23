import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStatePrePaymentCreate = {
  prePaymentCreate: { data: null, loading: false, error: null },
};

export const prePaymentCreate = createAsyncThunk('employee/prePaymentCreate', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/prepayment/create`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerPrePaymentCreate = {
  [prePaymentCreate.pending]: (state) => {
    state.prePaymentCreate.loading = true;
  },
  [prePaymentCreate.fulfilled]: (state, action) => {
    state.prePaymentCreate.loading = false;
    state.prePaymentCreate.data = action.payload;
    state.prePaymentCreate.error = null;
  },
  [prePaymentCreate.rejected]: (state, action) => {
    state.prePaymentCreate.loading = false;
    state.prePaymentCreate.error = action.payload;
  },
};
