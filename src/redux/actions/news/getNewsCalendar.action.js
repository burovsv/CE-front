import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetNewsCalendar = {
  getNewsCalendar: { data: null, loading: false, error: null },
};

export const getNewsCalendar = createAsyncThunk('news/getNewsCalendar', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/news/calendar`)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      console.log(res);
      return rejectWithValue(res.response.data);
    });
});

export const reducerGetNewsCalendar = {
  [getNewsCalendar.pending]: (state) => {
    state.getNewsCalendar.loading = true;
  },
  [getNewsCalendar.fulfilled]: (state, action) => {
    state.getNewsCalendar.loading = false;
    state.getNewsCalendar.data = action.payload;

    state.getNewsCalendar.error = null;
  },
  [getNewsCalendar.rejected]: (state, action) => {
    state.getNewsCalendar.loading = false;
    state.getNewsCalendar.error = action.payload;
  },
};
