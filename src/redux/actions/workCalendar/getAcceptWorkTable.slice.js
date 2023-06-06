import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAcceptWorkTable = {
  getAcceptWorkTable: { data: [], loading: false, error: null },
};

export const getAcceptWorkTable = createAsyncThunk('workTable/getAcceptWorkTable', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/work-calendar/accept`, {
      params: {
        date: data?.date,
      },
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetAcceptWorkTable = {
  [getAcceptWorkTable.pending]: (state) => {
    state.getAcceptWorkTable.loading = true;
  },
  [getAcceptWorkTable.fulfilled]: (state, action) => {
    state.getAcceptWorkTable.loading = false;
    state.getAcceptWorkTable.data = action.payload;
    state.getAcceptWorkTable.error = null;
  },
  [getAcceptWorkTable.rejected]: (state, action) => {
    state.getAcceptWorkTable.loading = false;
    state.getAcceptWorkTable.error = action.payload;
  },
};
