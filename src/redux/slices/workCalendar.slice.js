import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { initStateGetWorkCalendarMonth, reducerGetWorkCalendarMonth } from '../actions/workCalendar/getWorkCalendarMonth.slice';
import { initStateUpsertWorkCalendarFull, reducerUpsertWorkCalendarFull } from '../actions/workCalendar/upsertWorkCalendarFull.slice';
import { initStateExportWorkCalendarToExcel, reducerExportWorkCalendarToExcel } from '../actions/workCalendar/exportWorkCalendarToExcel.slice';
import { initStateGetAcceptWorkTable, reducerGetAcceptWorkTable } from '../actions/workCalendar/getAcceptWorkTable.slice';
import { initStateSwitchAcceptWorkTable, reducerSwitchAcceptWorkTable } from '../actions/workCalendar/switchAcceptWorkTable.slice';
import { initStateGetAcceptWorkTableSingle, reducerGetAcceptWorkTableSingle } from '../actions/workCalendar/getAcceptWorkTableSingle.slice';

export const initialState = {
  ...initStateGetWorkCalendarMonth,
  ...initStateUpsertWorkCalendarFull,
  ...initStateExportWorkCalendarToExcel,
  ...initStateGetAcceptWorkTable,
  ...initStateSwitchAcceptWorkTable,
  ...initStateGetAcceptWorkTableSingle,
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
    resetSwitchAcceptWorkTable(state) {
      state.switchAcceptWorkTable = initStateSwitchAcceptWorkTable.switchAcceptWorkTable;
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
    resetExportWorkCalendarToExcel(state) {
      state.exportWorkCalendarToExcel = initStateExportWorkCalendarToExcel.exportWorkCalendarToExcel;
    },
  },
  extraReducers: {
    ...reducerGetWorkCalendarMonth,
    ...reducerUpsertWorkCalendarFull,
    ...reducerExportWorkCalendarToExcel,
    ...reducerGetAcceptWorkTable,
    ...reducerSwitchAcceptWorkTable,
    ...reducerGetAcceptWorkTableSingle,
  },
});
export const { resetgetTestingFilters, resetCreateTestingFilter, setActiveMonthYear, setShowFullCalendar, resetUpsertWorkCalendarFull, resetExportWorkCalendarToExcel, resetSwitchAcceptWorkTable } = workCalendarSlice.actions;
export const workCalendarReducer = workCalendarSlice.reducer;
