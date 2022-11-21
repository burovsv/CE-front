import { createSlice } from '@reduxjs/toolkit';
import { initStateGlobalSearch, reducerGlobalSearch } from '../actions/search/globalSearch.action';

export const initialState = {
  ...initStateGlobalSearch,
  searchTerm: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: {
    ...reducerGlobalSearch,
  },
});
export const { setSearchTerm } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
