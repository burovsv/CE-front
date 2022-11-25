import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { initStateGetWorkCalendarMonth, reducerGetWorkCalendarMonth } from '../actions/workCalendar/getWorkCalendarMonth.slice';
import { initStateUpsertWorkCalendarFull, reducerUpsertWorkCalendarFull } from '../actions/workCalendar/upsertWorkCalendarFull.slice';

export const initialState = {
  ...initStateGetWorkCalendarMonth,
  ...initStateUpsertWorkCalendarFull,
  activeMonthYear: moment().set('date', 1).toDate(),
  showFullCalendar: false,
};

export const workCalendarSlice = createSlice({
  name: 'workCalendar',
  initialState,
  reducers: {
    resetGetWorkCalendarMonth(state) {
      state.getWorkCalendarMonth = initStateGetWorkCalendarMonth.getWorkCalendarMonth;
    },
    setActiveMonthYear(state, action) {
      state.activeMonthYear = action.payload;
    },
    setShowFullCalendar(state, action) {
      state.showFullCalendar = action.payload;
    },
    resetUpsertWorkCalendarFull(state) {
      state.upsertWorkCalendarFull = initStateUpsertWorkCalendarFull.upsertWorkCalendarFull;
    },
  },
  extraReducers: {
    ...reducerGetWorkCalendarMonth,
    ...reducerUpsertWorkCalendarFull,
  },
});
export const { resetgetTestingFilters, resetCreateTestingFilter, setActiveMonthYear, setShowFullCalendar, resetUpsertWorkCalendarFull } = workCalendarSlice.actions;
export const workCalendarReducer = workCalendarSlice.reducer;
