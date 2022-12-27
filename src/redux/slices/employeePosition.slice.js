import { createSlice } from '@reduxjs/toolkit';
import { initStateGetEmployees, reducerGetEmployeePositions } from '../actions/employeePosition/getEmployeePositions.action';

export const initialState = {
    ...initStateGetEmployees,
};

export const employeePositionSlice = createSlice({
    name: 'employeePosition',
    initialState,
    reducers: {
        resetGetEmployeePositions(state) {
            state.getEmployeePositions = initStateGetEmployees.getEmployeePositions;
        }
    },
    extraReducers: {
        ...reducerGetEmployeePositions,
    },
});
export const { resetGetEmployeePositions } = employeePositionSlice.actions;
export const employeePositionReducer = employeePositionSlice.reducer;
