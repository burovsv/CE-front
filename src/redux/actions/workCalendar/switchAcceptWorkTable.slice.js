import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateSwitchAcceptWorkTable = {
  switchAcceptWorkTable: { data: [], loading: false, error: null },
};

export const switchAcceptWorkTable = createAsyncThunk('testingFilter/switchAcceptWorkTable', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/work-calendar/accept`, {
      date: data?.date,
      subdivisionId: data?.subdivisionId,
      accept: data?.accept,
    })
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerSwitchAcceptWorkTable = {
  [switchAcceptWorkTable.pending]: (state) => {
    state.switchAcceptWorkTable.loading = true;
  },
  [switchAcceptWorkTable.fulfilled]: (state, action) => {
    state.switchAcceptWorkTable.loading = false;
    state.switchAcceptWorkTable.data = action.payload;
    state.switchAcceptWorkTable.error = null;
  },
  [switchAcceptWorkTable.rejected]: (state, action) => {
    state.switchAcceptWorkTable.loading = false;
    state.switchAcceptWorkTable.error = action.payload;
  },
};
