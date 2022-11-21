import { createSlice } from '@reduxjs/toolkit';
import { initStateCreateNewsFilter, reducerCreateNewsFilter } from '../actions/newsFilter/createNewsFilter.action';
import { initStategetNewsFilters, reducergetNewsFilters } from '../actions/newsFilter/getNewsFilters.action';
import { initStateGetNewsFiltersUser, reducerGetNewsFiltersUser } from '../actions/newsFilter/getNewsFiltersUser.action';

export const initialState = {
  ...initStategetNewsFilters,
  ...initStateCreateNewsFilter,
  ...initStateGetNewsFiltersUser,
};

export const newsFilterSlice = createSlice({
  name: 'newsFilter',
  initialState,
  reducers: {
    resetgetNewsFilters(state) {
      state.getNewsFilters = initStategetNewsFilters.getNewsFilters;
    },
    resetCreateNewsFilter(state) {
      state.createNewsFilter = initStateCreateNewsFilter.createNewsFilter;
    },
    resetGetNewsFilterUser(state) {
      state.getNewsFiltersUser = initStateGetNewsFiltersUser.getNewsFiltersUser;
    },
  },
  extraReducers: {
    ...reducergetNewsFilters,
    ...reducerCreateNewsFilter,
    ...reducerGetNewsFiltersUser,
  },
});
export const { resetgetNewsFilters, resetCreateNewsFilter, resetGetNewsFilterUser } = newsFilterSlice.actions;
export const newsFilterReducer = newsFilterSlice.reducer;
