import { createSlice } from '@reduxjs/toolkit';
import { initStateGetEmployeeHiddenList, reducerGetEmployeeHiddenList } from '../actions/employeeHidden/getEmployeeHiddenList.action';

export const initialState = {
  ...initStateGetEmployeeHiddenList,
  activeCalendarSubdivision: null,
};

export const employeeHiddenSlice = createSlice({
  name: 'employeeHidden',
  initialState,
  reducers: {
    resetGetEmployeeHidden(state) {
      state.getEmployeeHidden = initStateGetEmployeeHiddenList.getEmployeeHidden;
    },
  },
  extraReducers: {
    ...reducerGetEmployeeHiddenList,
  },
});
export const { resetGetEmployeeHidden } = employeeHiddenSlice.actions;
export const employeeHiddenReducer = employeeHiddenSlice.reducer;
