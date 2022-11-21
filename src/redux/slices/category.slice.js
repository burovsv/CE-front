import { createSlice } from '@reduxjs/toolkit';
import { initStateCreateCategory, reducerCreateCategory } from '../actions/category/createCategory';
import { initStategetCatsByPostAndSubdiv, reducergetCatsByPostAndSubdiv } from '../actions/category/getCatsByPostAndSubdiv';

export const initialState = {
  ...initStategetCatsByPostAndSubdiv,
  ...initStateCreateCategory,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    resetGetCatsByPostAndSubdiv(state) {
      state.getCatsByPostAndSubdiv = initStategetCatsByPostAndSubdiv.getCatsByPostAndSubdiv;
    },
    resetCreateCategory(state) {
      state.createCategory = initStateCreateCategory.createCategory;
    },
  },
  extraReducers: {
    ...reducergetCatsByPostAndSubdiv,
    ...reducerCreateCategory,
  },
});
export const { resetGetCatsByPostAndSubdiv, resetCreateCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
