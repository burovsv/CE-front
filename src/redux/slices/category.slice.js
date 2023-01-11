import { createSlice } from '@reduxjs/toolkit';
import { initStateCreateCategory, reducerCreateCategory } from '../actions/category/createCategory';
import { initStateGetCategories, reducerGetCategories } from '../actions/category/getCategories';
import { initStategetCatsByPostAndSubdiv, reducergetCatsByPostAndSubdiv } from '../actions/category/getCatsByPostAndSubdiv';

export const initialState = {
  ...initStategetCatsByPostAndSubdiv,
  ...initStateCreateCategory,
  ...initStateGetCategories,
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
    ...reducerGetCategories,
  },
});
export const { resetGetCatsByPostAndSubdiv, resetCreateCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
