import { createSlice } from '@reduxjs/toolkit';
import { initStateGetEmployeeHistory, reducerGetEmployeeHistory } from '../actions/employeeHistory/getEmployeeHistory.action';

export const initialState = {
  ...initStateGetEmployeeHistory,
  activeCalendarSubdivision: null,
};

export const employeeHistorySlice = createSlice({
  name: 'employeeHistory',
  initialState,
  reducers: {
    resetGetEmployeeHistory(state) {
      state.getEmployeeHistory = initStateGetEmployeeHistory.getEmployeeHistory;
    },
    setActiveCalendarSubdivision(state, action) {
      state.activeCalendarSubdivision = action.payload;
    },
  },
  extraReducers: {
    ...reducerGetEmployeeHistory,
  },
});
export const { resetGetEmployeeHistory, setActiveCalendarSubdivision } = employeeHistorySlice.actions;
export const employeeHistoryReducer = employeeHistorySlice.reducer;
