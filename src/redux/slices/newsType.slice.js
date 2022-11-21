import { createSlice } from '@reduxjs/toolkit';
import { initStateGetNewsTypes, reducerGetNewsTypes } from '../actions/newsType/getNewsTypes.action';

export const initialState = {
  ...initStateGetNewsTypes,
};

export const newsTypeSlice = createSlice({
  name: 'newsType',
  initialState,
  reducers: {
    resetGetNewsTypes(state) {
      state.getNewsTypes = initStateGetNewsTypes.getNewsTypes;
    },
  },
  extraReducers: {
    ...reducerGetNewsTypes,
  },
});
export const { resetGetNewsTypes } = newsTypeSlice.actions;
export const newsTypeReducer = newsTypeSlice.reducer;
