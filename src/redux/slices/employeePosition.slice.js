import { createSlice } from '@reduxjs/toolkit';
import { initStateGetEmployeePositions, reducerGetEmployeePositions } from '../actions/employeePosition/getEmployeePositions.action';

export const initialState = {
    ...initStateGetEmployeePositions,
};

export const employeePositionSlice = createSlice({
    name: 'employeePosition',
    initialState,
    reducers: {
        resetGetEmployeePositions(state) {
            state.getEmployeePositions = initStateGetEmployeePositions.getEmployeePositions;
        }
    },
    extraReducers: {
        ...reducerGetEmployeePositions,
    },
});
export const { resetGetEmployeePositions } = employeePositionSlice.actions;
export const employeePositionReducer = employeePositionSlice.reducer;
