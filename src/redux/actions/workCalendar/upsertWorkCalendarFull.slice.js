import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateUpsertWorkCalendarFull = {
  upsertWorkCalendarFull: { data: null, loading: false, error: null },
};

export const upsertWorkCalendarFull = createAsyncThunk('testingFilter/upsertWorkCalendarFull', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .post(`${process.env.REACT_APP_SERVER_API}/work-calendar/update`, data)
    .then((res) => {
      return fulfillWithValue(res.data);
    })
    .catch((res) => {
      return rejectWithValue(res.response.data);
    });
});

export const reducerUpsertWorkCalendarFull = {
  [upsertWorkCalendarFull.pending]: (state) => {
    state.upsertWorkCalendarFull.loading = true;
  },
  [upsertWorkCalendarFull.fulfilled]: (state, action) => {
    state.upsertWorkCalendarFull.loading = false;
    state.upsertWorkCalendarFull.data = action.payload;
    state.upsertWorkCalendarFull.error = null;
  },
  [upsertWorkCalendarFull.rejected]: (state, action) => {
    state.upsertWorkCalendarFull.loading = false;
    state.upsertWorkCalendarFull.error = action.payload;
  },
};
