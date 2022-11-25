import { createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const initStateGetWorkCalendarMonth = {
  getWorkCalendarMonth: { data: [], loading: false, error: null },
};

export const getWorkCalendarMonth = createAsyncThunk('testingFilter/getWorkCalendarMonth', async (data, { rejectWithValue, fulfillWithValue }) => {
  return await axios
    .get(`${process.env.REACT_APP_SERVER_API}/work-calendar/month`, {
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

export const reducerGetWorkCalendarMonth = {
  [getWorkCalendarMonth.pending]: (state) => {
    state.getWorkCalendarMonth.loading = true;
  },
  [getWorkCalendarMonth.fulfilled]: (state, action) => {
    state.getWorkCalendarMonth.loading = false;
    const newData = action.payload;
    console.log(newData?.workCalendars?.[0]);
    if (newData?.workCalendars?.[0]) {
      try {
        newData.workCalendars = JSON.parse(newData?.workCalendars?.[0]?.calendarData);
      } catch (error) {
        newData.workCalendars = [];
      }
    } else {
      newData.workCalendars = [];
    }
    state.getWorkCalendarMonth.data = action.payload;
    state.getWorkCalendarMonth.error = null;
  },
  [getWorkCalendarMonth.rejected]: (state, action) => {
    state.getWorkCalendarMonth.loading = false;
    state.getWorkCalendarMonth.error = action.payload;
  },
};
