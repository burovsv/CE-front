import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetAcceptWorkTableSingle = {
  getAcceptWorkTableSingle: { data: null, loading: false, error: null },
};

export const getAcceptWorkTableSingle = createAsyncThunk('workTable/getAcceptWorkTableSingle', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/work-calendar/accept-single`, {
      params: {
        date: data?.date,
        subdivisionId: data?.subdivisionId,
      },
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetAcceptWorkTableSingle = {
  [getAcceptWorkTableSingle.pending]: (state) => {
    state.getAcceptWorkTableSingle.loading = true;
  },
  [getAcceptWorkTableSingle.fulfilled]: (state, action) => {
    state.getAcceptWorkTableSingle.loading = false;
    state.getAcceptWorkTableSingle.data = action.payload;
    state.getAcceptWorkTableSingle.error = null;
  },
  [getAcceptWorkTableSingle.rejected]: (state, action) => {
    state.getAcceptWorkTableSingle.loading = false;
    state.getAcceptWorkTableSingle.error = action.payload;
  },
};
