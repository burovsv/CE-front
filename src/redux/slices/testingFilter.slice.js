import { createSlice } from '@reduxjs/toolkit';
import { initStateCreateTestingFilter, reducerCreateTestingFilter } from '../actions/testingFilter/createTestingFilter.action';
import { initStategetTestingFilters, reducergetTestingFilters } from '../actions/testingFilter/getTestingFilters.action';
import { initStategetTestingFiltersUser, reducergetTestingFiltersUser } from '../actions/testingFilter/getTestingFiltersUser.action';

export const initialState = {
  ...initStategetTestingFilters,
  ...initStateCreateTestingFilter,
  ...initStategetTestingFiltersUser,
};

export const testingFilterSlice = createSlice({
  name: 'testingFilter',
  initialState,
  reducers: {
    resetgetTestingFilters(state) {
      state.getTestingFilters = initStategetTestingFilters.getTestingFilters;
    },
    resetCreateTestingFilter(state) {
      state.createTestingFilter = initStateCreateTestingFilter.createTestingFilter;
    },
    // resetGetTestingFilterUser(state) {
    //   state.getTestingFiltersUser = initStateGetTestingFiltersUser.getTestingFiltersUser;
    // },
  },
  extraReducers: {
    ...reducergetTestingFilters,
    ...reducerCreateTestingFilter,
    ...reducergetTestingFiltersUser,
  },
});
export const { resetgetTestingFilters, resetCreateTestingFilter } = testingFilterSlice.actions;
export const testingFilterReducer = testingFilterSlice.reducer;
