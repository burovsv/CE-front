import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetCashBoxList = {
  getCashBoxList: { data: null, loading: false, error: null },
};

export const getCashBoxList = createAsyncThunk('employee/getCashBoxList', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/prepayment/cashbox`, { params: { subdivision: data } })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetCashBoxList = {
  [getCashBoxList.pending]: (state) => {
    state.getCashBoxList.loading = true;
  },
  [getCashBoxList.fulfilled]: (state, action) => {
    state.getCashBoxList.loading = false;
    state.getCashBoxList.data = action.payload;
    state.getCashBoxList.error = null;
  },
  [getCashBoxList.rejected]: (state, action) => {
    state.getCashBoxList.loading = false;
    state.getCashBoxList.error = action.payload;
  },
};
