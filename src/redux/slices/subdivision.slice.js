import { createSlice } from '@reduxjs/toolkit';
import { initStateGetSubdivisions, reducerGetSubdivisions } from '../actions/subdivision/getSubdivisions.action';
import { initStateGetSubdivisionsByPosts, reducerGetSubdivisionsByPosts } from '../actions/subdivision/getSubdivisionsByPosts.action';
import { initStateGetSubdivisionsWithPosts, reducerGetSubdivisionsWithPosts } from '../actions/subdivision/getSubdivisionWithPosts.action';

export const initialState = {
  ...initStateGetSubdivisions,
  ...initStateGetSubdivisionsByPosts,
  ...initStateGetSubdivisionsWithPosts,
};

export const subdivisionSlice = createSlice({
  name: 'subdivision',
  initialState,
  reducers: {
    resetGetSubdivisionsWithPosts(state) {
      state.getSubdivisionsWithPosts = initStateGetSubdivisionsWithPosts.getSubdivisionsWithPosts;
    },
    resetGetSubdivisions(state) {
      state.getSubdivisions = initStateGetSubdivisions.getSubdivisions;
    },
    resetGetSubdivisionsByPosts(state) {
      state.getSubdivisionsByPosts = initStateGetSubdivisionsByPosts.getSubdivisionsByPosts;
    },
  },
  extraReducers: {
    ...reducerGetSubdivisions,
    ...reducerGetSubdivisionsByPosts,
    ...reducerGetSubdivisionsWithPosts,
  },
});
export const { resetGetSubdivisionsWithPosts, resetGetSubdivisions, resetGetSubdivisionsByPosts } = subdivisionSlice.actions;
export const subdivisionReducer = subdivisionSlice.reducer;
