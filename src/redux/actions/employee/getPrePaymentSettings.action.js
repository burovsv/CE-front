import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetPrePaymentSettings = {
  getPrePaymentSettings: { data: [], loading: false, error: null },
};

export const getPrePaymentSettings = createAsyncThunk('employee/getPrePaymentSettings', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/prepayment-date`, { params: data })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetPrePaymentSettings = {
  [getPrePaymentSettings.pending]: (state) => {
    state.getPrePaymentSettings.loading = true;
  },
  [getPrePaymentSettings.fulfilled]: (state, action) => {
    state.getPrePaymentSettings.loading = false;
    state.getPrePaymentSettings.data = action.payload;
    state.getPrePaymentSettings.error = null;
  },
  [getPrePaymentSettings.rejected]: (state, action) => {
    state.getPrePaymentSettings.loading = false;
    state.getPrePaymentSettings.error = action.payload;
  },
};
